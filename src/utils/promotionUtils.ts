interface GeneratePromotionNameParams {
  type: string;
  priceAdjustmentType: string;
  priceAdjustmentPercentage: number;
  priceUpdateOption: string;
  startDateTime: Date;
  endDateTime: Date;
}

export async function generatePromotionName(params: GeneratePromotionNameParams) {
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('PERPLEXITY_API_KEY') || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a marketing expert that creates catchy promotion names. Be creative but concise.'
          },
          {
            role: 'user',
            content: `Generate a catchy promotion name for a ${params.type} with the following details:
              - Price adjustment: ${params.priceAdjustmentType} ${params.priceAdjustmentPercentage}%
              - Price update strategy: ${params.priceUpdateOption}
              - Start date: ${params.startDateTime.toLocaleDateString()}
              - End date: ${params.endDateTime.toLocaleDateString()}`
          }
        ],
        temperature: 0.8,
        max_tokens: 50
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating promotion name:', error);
    return null;
  }
}