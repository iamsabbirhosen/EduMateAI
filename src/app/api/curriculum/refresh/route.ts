import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // This endpoint can be called to manually refresh the curriculum cache
    // In a production environment, you might want to add authentication here
    
    return NextResponse.json({ 
      success: true, 
      message: 'Curriculum cache will be refreshed on next request' 
    });
  } catch (error) {
    console.error('Error in refresh curriculum API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to refresh curriculum' },
      { status: 500 }
    );
  }
}
