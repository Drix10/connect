import { Portfolio, PortfolioCredit, CarbonCredit } from '@/lib/types';

export function buyCredit(
    credit: CarbonCredit,
    portfolio: Portfolio
): Portfolio {
    // Validate inputs
    if (!credit || !credit.id) {
        throw new Error('Invalid credit: missing credit data');
    }

    if (!portfolio) {
        throw new Error('Invalid portfolio: missing portfolio data');
    }

    if (credit.volume <= 0) {
        throw new Error('Invalid credit: volume must be greater than 0');
    }

    if (credit.pricePerTonne <= 0) {
        throw new Error('Invalid credit: price must be greater than 0');
    }

    // Check if credit already in portfolio
    const existingCredit = portfolio.credits.find((c) => c.id === credit.id);

    if (existingCredit) {
        throw new Error('Credit already in portfolio');
    }

    // Create portfolio credit
    const portfolioCredit: PortfolioCredit = {
        ...credit,
        quantity: credit.volume,
        purchasePrice: credit.pricePerTonne,
        purchaseDate: new Date().toISOString(),
        status: 'owned',
    };

    // Update portfolio
    const updatedCredits = [...portfolio.credits, portfolioCredit];
    const totalValue = updatedCredits.reduce(
        (sum, c) => sum + c.quantity * c.pricePerTonne,
        0
    );
    const totalVolume = updatedCredits.reduce((sum, c) => sum + c.quantity, 0);

    return {
        credits: updatedCredits,
        totalValue,
        totalVolume,
    };
}

export function sellCredit(
    creditId: string,
    portfolio: Portfolio
): Portfolio {
    // Validate inputs
    if (!creditId || creditId.trim().length === 0) {
        throw new Error('Invalid credit ID: empty string');
    }

    if (!portfolio) {
        throw new Error('Invalid portfolio: missing portfolio data');
    }

    // Check if credit exists in portfolio
    const creditExists = portfolio.credits.some((c) => c.id === creditId);
    if (!creditExists) {
        throw new Error('Credit not found in portfolio');
    }

    // Remove credit from portfolio
    const updatedCredits = portfolio.credits.filter((c) => c.id !== creditId);

    const totalValue = updatedCredits.reduce(
        (sum, c) => sum + c.quantity * c.pricePerTonne,
        0
    );
    const totalVolume = updatedCredits.reduce((sum, c) => sum + c.quantity, 0);

    return {
        credits: updatedCredits,
        totalValue,
        totalVolume,
    };
}

export function calculateCurrentValue(
    portfolioCredit: PortfolioCredit,
    currentPrice: number
): number {
    if (!portfolioCredit) {
        throw new Error('Invalid portfolio credit: missing data');
    }

    if (currentPrice < 0) {
        throw new Error('Invalid current price: must be non-negative');
    }

    return portfolioCredit.quantity * currentPrice;
}

export function calculateProfitLoss(
    portfolioCredit: PortfolioCredit,
    currentPrice: number
): number {
    if (!portfolioCredit) {
        throw new Error('Invalid portfolio credit: missing data');
    }

    if (currentPrice < 0) {
        throw new Error('Invalid current price: must be non-negative');
    }

    const currentValue = calculateCurrentValue(portfolioCredit, currentPrice);
    const purchaseValue = portfolioCredit.quantity * portfolioCredit.purchasePrice;
    return currentValue - purchaseValue;
}

export function calculateProfitLossPercentage(
    portfolioCredit: PortfolioCredit,
    currentPrice: number
): number {
    if (!portfolioCredit) {
        throw new Error('Invalid portfolio credit: missing data');
    }

    if (currentPrice < 0) {
        throw new Error('Invalid current price: must be non-negative');
    }

    const profitLoss = calculateProfitLoss(portfolioCredit, currentPrice);
    const purchaseValue = portfolioCredit.quantity * portfolioCredit.purchasePrice;

    // Prevent division by zero
    if (purchaseValue === 0) {
        return 0;
    }

    return (profitLoss / purchaseValue) * 100;
}
