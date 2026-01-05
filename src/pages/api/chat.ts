import type { APIRoute } from 'astro';
import ChatbotModel from '../../lib/chatbot-model';

// Create a singleton instance of the chatbot model
const chatbot = new ChatbotModel();

export const POST: APIRoute = async ({ request }) => {
  try {
    // Get request body directly
    let body;
    
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!body) {
      return new Response(JSON.stringify({ error: 'Empty request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { messages } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid request format - messages array required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get the latest user message
    const userMessages = messages.filter((m: any) => m.role === 'user');
    const latestMessage = userMessages[userMessages.length - 1]?.content || '';

    if (!latestMessage) {
      return new Response(
        JSON.stringify({
          error: 'No user message found',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate response using our custom ML model
    const reply = chatbot.generateResponse(latestMessage, messages);

    return new Response(
      JSON.stringify({
        reply,
        model: 'custom-ml-v1',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};
