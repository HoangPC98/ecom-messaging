export type SystemSendSmsT = {
  to: string;
  text: string;
}

export type MsgSmsContent = {
  id: string;
  to_number: string;
  value: string;
  type: string;
  expried_in: string;
}