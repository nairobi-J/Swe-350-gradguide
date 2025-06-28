const API_BASE_URL = 'http://localhost:5000';

export async function sendMessage(message: string, maxLength: number = 150): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        max_length: maxLength,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from server');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.response;
  } catch (error) {
    console.error('Chat service error:', error);
    throw error instanceof Error ? error : new Error('Unknown error occurred');
  }
}