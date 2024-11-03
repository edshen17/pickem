export function calculateTournamentRounds(numPlayers: number): number {
  if (numPlayers <= 0) {
    throw new Error('Number of players must be positive')
  }

  return Math.ceil(Math.log2(numPlayers))
}
