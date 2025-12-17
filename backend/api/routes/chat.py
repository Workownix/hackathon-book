"""
RAG Chatbot API Routes (+50 points)
Google Gemini + Qdrant Vector Search
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import os
import time
import google.generativeai as genai
from qdrant_client import QdrantClient
from qdrant_client.models import Filter, FieldCondition, MatchValue
from app.config import settings

router = APIRouter()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Initialize clients
gemini_model = genai.GenerativeModel(os.getenv("GEMINI_MODEL", "gemini-pro"))
gemini_embedding_model = os.getenv("EMBEDDING_MODEL", "embedding-001")

qdrant_client = QdrantClient(
    url=os.getenv("QDRANT_URL"),
    api_key=os.getenv("QDRANT_API_KEY")
)

COLLECTION_NAME = settings.qdrant_collection_name
EMBEDDING_DIMENSION = 1536 # This might need adjustment based on Gemini's embedding model output


class ChatQuery(BaseModel):
    query: str
    user_id: Optional[int] = None
    selected_text: Optional[str] = None
    module_filter: Optional[str] = None


class Source(BaseModel):
    module: str
    chapter: str
    section: Optional[str] = None
    url: str
    relevance_score: float


class ChatResponse(BaseModel):
    answer: str
    sources: List[Source]
    conversation_id: str
    processing_time: int
    timestamp: str


@router.post("/query", response_model=ChatResponse)
async def chat_query(query: ChatQuery):
    """
    RAG Chatbot Endpoint
    - Embeds user query with Gemini
    - Searches Qdrant for relevant chunks
    - Generates answer with Gemini + context
    """
    start_time = time.time()

    try:
        # Step 1: Generate embedding for the query
        query_text = query.selected_text or query.query

        embedding_response = genai.embed_content(
            model=gemini_embedding_model,
            content=query_text
        )
        query_embedding = embedding_response['embedding']

        # Step 2: Search Qdrant for relevant chunks
        search_filter = None
        if query.module_filter:
            search_filter = Filter(
                must=[
                    FieldCondition(
                        key="module",
                        match=MatchValue(value=query.module_filter)
                    )
                ]
            )

        search_results = qdrant_client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_embedding,
            query_filter=search_filter,
            limit=5  # Top 5 most relevant chunks
        )

        # Step 3: Build context from retrieved chunks
        context_parts = []
        sources = []

        for idx, result in enumerate(search_results):
            payload = result.payload
            context_parts.append(
                f"[Source {idx + 1}] ({payload.get('file', payload.get('module', 'unknown'))})\n{payload.get('text', payload.get('content', ''))}\n"
            )

            sources.append(Source(
                module=payload.get('module', 'Unknown'),
                chapter=payload.get('chapter', 'Unknown'),
                section=payload.get('section'),
                url=payload.get('url', '/'),
                relevance_score=round(result.score, 3)
            ))

        context = "\n".join(context_parts)

        # Step 4: Generate answer with Gemini
        system_prompt = """You are an expert AI assistant for the Physical AI & Humanoid Robotics textbook.

Your role:
- Answer questions accurately using ONLY the provided context
- Cite sources using [Source N] notation
- If the context doesn't contain the answer, say so clearly
- Be concise but comprehensive
- Use technical terminology appropriately

Format your responses with:
- Clear explanations
- Code examples when relevant
- References to specific modules/chapters"""

        user_prompt = f"""Context from the textbook:
{context}

User Question: {query.query}

Please provide a detailed answer based ONLY on the context above. Include source citations."""

        # Gemini typically handles system instructions in the first user message or as part of the prompt
        # For simplicity, we'll combine it into the user prompt.
        full_prompt = f"{system_prompt}\n\n{user_prompt}"
        
        response = gemini_model.generate_content(
            full_prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                max_output_tokens=800
            )
        )
        answer = response.text

        # Calculate processing time
        processing_time = int((time.time() - start_time) * 1000)  # milliseconds

        return ChatResponse(
            answer=answer,
            sources=sources,
            conversation_id=f"conv_{int(time.time())}",
            processing_time=processing_time,
            timestamp=time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        )

    except Exception as e:
        # Log error
        print(f"RAG Error: {str(e)}")

        # Return fallback response
        raise HTTPException(
            status_code=500,
            detail=f"RAG processing error: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """
    Check if RAG system is operational
    """
    try:
        # Check Gemini API
        gemini_status = "connected" if os.getenv("GEMINI_API_KEY") else "missing_api_key"

        # Check Qdrant
        try:
            collections = qdrant_client.get_collections()
            qdrant_status = "connected"
            collection_exists = any(c.name == COLLECTION_NAME for c in collections.collections)
        except Exception: # Catch specific exceptions if possible
            qdrant_status = "disconnected"
            collection_exists = False

        return {
            "status": "healthy" if (gemini_status == "connected" and collection_exists) else "degraded",
            "services": {
                "gemini": gemini_status,
                "qdrant": qdrant_status,
                "collection_exists": collection_exists,
                "collection_name": COLLECTION_NAME
            }
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "error": str(e)
        }


@router.get("/history/{user_id}")
async def get_chat_history(user_id: int, limit: int = 10):
    """Get chat history for a user (Future: implement with database)"""
    # TODO: Implement database query for chat history
    return {
        "user_id": user_id,
        "messages": [],
        "note": "Chat history feature will be implemented in Phase 2"
    }

