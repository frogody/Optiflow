#!/usr/bin/env python3
"""
CORS Test Script for Voice Agent Service

This script tests whether the CORS configuration is working correctly
by sending OPTIONS and GET requests to various endpoints.
"""

import requests
import argparse
import sys

def test_endpoint_cors(url, origin="https://app.isyncso.com"):
    """Test CORS headers on a specific endpoint using OPTIONS request."""
    print(f"\n----- Testing CORS on {url} -----")
    
    # Test OPTIONS request (preflight)
    headers = {
        "Origin": origin,
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
    }
    
    try:
        print(f"Sending OPTIONS request to {url} with Origin: {origin}")
        response = requests.options(url, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        
        # Print all headers
        print("\nResponse Headers:")
        for header, value in response.headers.items():
            print(f"  {header}: {value}")
        
        # Check for CORS headers
        cors_headers = [
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers",
            "Access-Control-Allow-Credentials"
        ]
        
        print("\nCORS Headers Check:")
        success = True
        for header in cors_headers:
            if header in response.headers:
                print(f"  ✅ {header}: {response.headers[header]}")
                
                # Check if origin is properly set
                if header == "Access-Control-Allow-Origin" and origin not in response.headers[header]:
                    print(f"  ❌ Warning: Origin {origin} not in Allow-Origin header!")
                    success = False
            else:
                print(f"  ❌ Missing {header}")
                success = False
        
        if success:
            print("\n✅ CORS configuration looks good!")
        else:
            print("\n❌ CORS configuration issues detected!")
        
    except requests.RequestException as e:
        print(f"Error: {e}")

def test_health_endpoint(url):
    """Test the health endpoint to ensure the service is running."""
    health_url = f"{url}/health"
    print(f"\n----- Testing Health Endpoint {health_url} -----")
    
    try:
        response = requests.get(health_url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            print("✅ Health endpoint is working!")
            return True
        else:
            print("❌ Health endpoint returned non-200 status code!")
            return False
        
    except requests.RequestException as e:
        print(f"Error connecting to health endpoint: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description="Test CORS configuration for Voice Agent Service")
    parser.add_argument("--url", default="http://localhost:8000", 
                        help="Base URL of the Voice Agent Service")
    parser.add_argument("--origin", default="https://app.isyncso.com", 
                        help="Origin to use in the CORS request")
    args = parser.parse_args()
    
    base_url = args.url
    
    # First check if the service is running
    if not test_health_endpoint(base_url):
        print("❌ Service health check failed. Aborting tests.")
        sys.exit(1)
    
    # Test each endpoint
    endpoints = [
        "/agent/dispatch",
        "/agent/token"
    ]
    
    for endpoint in endpoints:
        test_endpoint_cors(f"{base_url}{endpoint}", args.origin)
    
    print("\n----- CORS Testing Complete -----")

if __name__ == "__main__":
    main() 