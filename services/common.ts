export async function handleError(error: any) {
  if (error.value)
    throw new Error(`Request failed: ${error.value.message}`)
}
