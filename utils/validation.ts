import { z } from 'zod'

export function quasarConfig(state: any) {
  return {
    props: {
      'error': !!state.errors[0],
      'error-message': state.errors[0],
    },
  }
}
