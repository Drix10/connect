# CAD Trust API Client

This directory contains the API client for integrating with the CAD Trust Data Model 2.0 JSON-RPC v2.0 API.

## Overview

The CAD Trust API client provides a robust interface for fetching carbon project data from the live CAD Trust API at `https://rpc.climateactiondata.org/v2`. It includes automatic fallback to mock data when the API is unavailable, ensuring the application always has data to display.

## Features

- **JSON-RPC 2.0 Protocol**: Properly formatted requests following the JSON-RPC 2.0 specification
- **Timeout Handling**: 10-second timeout for API requests to prevent hanging
- **Error Handling**: Comprehensive error handling for network errors, HTTP errors, and RPC errors
- **Automatic Fallback**: Seamlessly falls back to mock data when the live API is unavailable
- **Data Source Indicator**: Returns whether data came from "live" API or "mock" data
- **Health Check**: Utility function to check if the API is reachable

## Usage

### Fetching a Project by Project UID

```typescript
import { fetchCADTrustProject } from "@/lib/api/cadTrust";

async function loadProject() {
  const result = await fetchCADTrustProject("verra-vcs-934");

  if (result.project) {
    console.log(`Project: ${result.project.projectName}`);
    console.log(`Data source: ${result.dataSource}`); // "live" or "mock"

    // Display appropriate badge based on data source
    if (result.dataSource === "live") {
      // Show "Live from CAD Trust Data Model 2.0" badge
    } else {
      // Show "Demo Data" badge
    }
  } else {
    console.error(`Failed to load project: ${result.error}`);
  }
}
```

### Fetching a Project by Registry ID

```typescript
import { fetchCADTrustProjectByRegistryId } from "@/lib/api/cadTrust";

async function loadProjectByRegistryId() {
  const result = await fetchCADTrustProjectByRegistryId("VCS-934");

  if (result.project) {
    console.log(`Project: ${result.project.projectName}`);
    console.log(`Registry: ${result.project.registryOfOrigin}`);
  }
}
```

### Checking API Health

```typescript
import { checkCADTrustAPIHealth } from "@/lib/api/cadTrust";

async function checkAPIStatus() {
  const isOnline = await checkCADTrustAPIHealth();

  if (isOnline) {
    console.log("CAD Trust API is online");
  } else {
    console.log("CAD Trust API is offline - using mock data");
  }
}
```

## API Response Structure

### Success Response

```typescript
{
  project: CADTrustProject,  // The project data
  dataSource: "live",        // Indicates live API data
  error: undefined           // No error
}
```

### Fallback Response

```typescript
{
  project: CADTrustProject,  // Mock project data
  dataSource: "mock",        // Indicates mock data
  error: "Network error"     // Error message from failed API call
}
```

### Not Found Response

```typescript
{
  project: null,                              // No data available
  dataSource: "mock",                         // Attempted mock fallback
  error: "Network error (no mock data available)"  // Error message
}
```

## Error Handling

The API client handles various error scenarios:

1. **Network Errors**: Connection failures, DNS errors, etc.
2. **HTTP Errors**: 4xx and 5xx status codes
3. **RPC Errors**: JSON-RPC error responses from the API
4. **Timeout Errors**: Requests that exceed 10 seconds
5. **Empty Results**: API returns null or undefined result

In all error cases, the client automatically falls back to mock data if available.

## JSON-RPC 2.0 Request Format

The client sends requests in the following format:

```json
{
  "jsonrpc": "2.0",
  "method": "cadt_getProject",
  "params": ["verra-vcs-934"],
  "id": 1234567890
}
```

## JSON-RPC 2.0 Response Format

### Success Response

```json
{
  "jsonrpc": "2.0",
  "result": {
    "projectId": "verra-vcs-934",
    "projectName": "Rimba Raya Biodiversity Reserve REDD+ Project",
    "registryOfOrigin": "Verra",
    ...
  },
  "id": 1234567890
}
```

### Error Response

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Invalid Request"
  },
  "id": 1234567890
}
```

## Testing

The API client includes comprehensive unit tests covering:

- Successful API responses
- JSON-RPC error responses
- HTTP error responses
- Network errors
- Timeout scenarios
- Mock data fallback
- Request formatting

Run tests with:

```bash
npm test -- lib/api/cadTrust.test.ts
```

## Requirements Satisfied

This implementation satisfies the following requirements from the Carbon Trade X MVP spec:

- **5.2**: Call CAD_Trust_API using JSON-RPC v2.0 protocol
- **5.3**: Use cadt_getProject method with Project_UID parameter
- **6.1**: Send JSON-RPC v2.0 requests to https://rpc.climateactiondata.org/v2
- **6.3**: Fall back to mock data when CAD_Trust_API is unavailable
- **6.4**: Implement 10-second timeout for CAD_Trust_API requests
- **6.5**: Log errors and fall back to mock data on error responses

## Future Enhancements

Potential improvements for future versions:

1. **Caching**: Cache API responses to reduce network requests
2. **Retry Logic**: Implement exponential backoff for failed requests
3. **Batch Requests**: Support fetching multiple projects in a single request
4. **Authentication**: Support API key authentication for authenticated requests
5. **Rate Limiting**: Implement client-side rate limiting to respect API limits
6. **Offline Detection**: Detect offline status and skip API calls when offline
