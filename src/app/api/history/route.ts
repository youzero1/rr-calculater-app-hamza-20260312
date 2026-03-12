import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/database';
import { CalculationHistory } from '@/entities/CalculationHistory';

export async function GET() {
  try {
    const dataSource = await getDataSource();
    const repository = dataSource.getRepository(CalculationHistory);
    const history = await repository.find({
      order: { createdAt: 'DESC' },
      take: 20,
    });
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result } = body;

    if (!expression || result === undefined || result === null) {
      return NextResponse.json(
        { error: 'Expression and result are required' },
        { status: 400 }
      );
    }

    const dataSource = await getDataSource();
    const repository = dataSource.getRepository(CalculationHistory);

    const entry = repository.create({
      expression: String(expression),
      result: String(result),
    });

    const saved = await repository.save(entry);
    return NextResponse.json({ entry: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving history:', error);
    return NextResponse.json(
      { error: 'Failed to save history' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const dataSource = await getDataSource();
    const repository = dataSource.getRepository(CalculationHistory);
    await repository.clear();
    return NextResponse.json({ message: 'History cleared' });
  } catch (error) {
    console.error('Error clearing history:', error);
    return NextResponse.json(
      { error: 'Failed to clear history' },
      { status: 500 }
    );
  }
}
