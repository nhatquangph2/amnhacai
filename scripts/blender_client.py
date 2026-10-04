#!/usr/bin/env python3
"""Client utility to control live Blender instance via BlenderMCP socket (port 9877)."""

import json
import socket
import sys
import argparse

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 9877

def send_blender_command(command_type, params=None, host=DEFAULT_HOST, port=DEFAULT_PORT, timeout=30.0):
    cmd = {"type": command_type}
    if params:
        cmd["params"] = params
    payload = json.dumps(cmd).encode("utf-8")

    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.settimeout(timeout)
    try:
        s.connect((host, port))
        s.sendall(payload)
        
        # Read until full json response
        chunks = []
        while True:
            chunk = s.recv(65536)
            if not chunk:
                break
            chunks.append(chunk)
            data = b"".join(chunks).decode("utf-8")
            try:
                return json.loads(data)
            except json.JSONDecodeError:
                continue
    finally:
        s.close()

def execute_code(code_str, host=DEFAULT_HOST, port=DEFAULT_PORT):
    return send_blender_command("execute_code", {"code": code_str}, host=host, port=port)

def get_scene_info(host=DEFAULT_HOST, port=DEFAULT_PORT):
    return send_blender_command("get_scene_info", host=host, port=port)

def ping(host=DEFAULT_HOST, port=DEFAULT_PORT):
    return send_blender_command("ping", host=host, port=port, timeout=3.0)

def main():
    parser = argparse.ArgumentParser(description="Blender MCP Client")
    subparsers = parser.add_subparsers(dest="command")

    subparsers.add_parser("ping")
    subparsers.add_parser("info")
    
    run_parser = subparsers.add_parser("run")
    run_parser.add_argument("file_or_code", help="Path to Python script or raw python snippet")
    run_parser.add_argument("-c", "--code", action="store_true", help="Treat argument as direct Python code string")

    args = parser.parse_args()

    if args.command == "ping":
        print(json.dumps(ping(), indent=2))
    elif args.command == "info":
        print(json.dumps(get_scene_info(), indent=2))
    elif args.command == "run":
        if args.code:
            code = args.file_or_code
        else:
            with open(args.file_or_code, "r", encoding="utf-8") as f:
                code = f.read()
        res = execute_code(code)
        if res.get("status") == "success":
            print(res.get("result", {}).get("result", ""))
        else:
            print("Error:", res.get("message", res), file=sys.stderr)
            sys.exit(1)
    else:
        parser.print_help()

if __name__ == "__main__":
    main()
