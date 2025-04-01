## Running

- deno run dev

## How to request?

- localhost:8000/?search=The%20Room

## docker run local

docker run -d -p 8000:8000 -e OVERSEERR_API_URL=URL -e OVERSEERR_API_KEY=KEY
wlee88/overseerr-client-api:latest

## docker build multi platform

docker buildx build --platform linux/amd64,linux/arm64 -t
wlee88/overseerr-client-api:latest . --push

## Required ENV

- OVERSEERR_API_URL - your overseerr API URL (e.g http://{unraid}:overseerrport)
- OVERSEERR_API_KEY - found in your overseerr settings under general

## Apple shortcut setup

- Ask for Text
- Url Encode (input: previous step)
- Get Contents of { this client api url }/?search={Url Encode from previous
  step}
