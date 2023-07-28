export function getCallbackUrl(): string {
  return `${process.env.HOST}/identity-provider/provider/callback`;
}
