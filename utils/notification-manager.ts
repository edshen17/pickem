import { Notify, type QNotifyCreateOptions } from 'quasar'

Notify.setDefaults({
  position: 'top-right',
  timeout: 2500,
  actions: [{ icon: 'close' }],
  classes: 'u-z-1000',
})

export class NotificationManager {
  static success = (message: string, options?: QNotifyCreateOptions) => {
    Notify.create({ message, type: 'positive', ...options })
  }

  static error = (message: string = 'An error occured. Please try again', options?: QNotifyCreateOptions) => {
    Notify.create({ message, type: 'negative', ...options })
  }

  static info = (message: string, options?: QNotifyCreateOptions) => {
    Notify.create({ message, type: 'info', ...options })
  }

  static warning = (message: string, options?: QNotifyCreateOptions) => {
    Notify.create({ message, type: 'warning', ...options })
  }
}
