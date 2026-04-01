import { useEffect, useRef, useState, useCallback } from "react"

const WS_BASE = process.env.NEXT_PUBLIC_COINGECKO_WS_URL || 'wss://stream.coingecko.com/v1';
const API_KEY = process.env.NEXT_PUBLIC_COINGECKO_API_KEY;

export const useCoinGeckoWebSocket = ({ coinId, poolId, liveInterval }: UseCoinGeckoWebSocketProps): UseCoinGeckoWebSocketReturn => {
    const wsRef = useRef<WebSocket | null>(null);
    const [price, setPrice] = useState<ExtendedPriceData | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [ohlcv, setOhlcv] = useState<OHLCData | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const connect = useCallback(() => {
        if (!API_KEY) return;
        
        const wsUrl = `${WS_BASE}?x_cg_demo_api_key=${API_KEY}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('WebSocket Connected');
            setIsConnected(true);
            
            // Subscribe to Simple Price channel (C1)
            const subscribeMessage = {
                action: 'subscribe',
                channel: 'C1',
                identifier: coinId
            };
            ws.send(JSON.stringify(subscribeMessage));
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                // Heartbeat
                if (event.data === 'ping') {
                    ws.send('pong');
                    return;
                }

                const data: WebSocketMessage = JSON.parse(event.data);
                
                // Handle Simple Price (C1)
                if ((data.type === 'C1' || data.channel === 'C1' || data.c === coinId) && data.p) {
                    setPrice({
                        usd: data.p,
                        price: data.p,
                        change24h: data.pp,
                        marketCap: data.m,
                        volume24h: data.v,
                        timestamp: data.t
                    });
                }

            } catch (error) {
                console.error('WS Message Error:', error);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected');
            setIsConnected(false);
            // Reconnect logic
            reconnectTimeoutRef.current = setTimeout(() => {
                connect();
            }, 5000);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            ws.close();
        };
    }, [coinId]);

    useEffect(() => {
        connect();
        
        // Polling Fallback (every 30 seconds if WS is not connected)
        const pollInterval = setInterval(async () => {
          if (!isConnected && API_KEY) {
            try {
              const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true&x_cg_demo_api_key=${API_KEY}`);
              const data = await res.json();
              if (data[coinId]) {
                const coinData = data[coinId];
                setPrice({
                  usd: coinData.usd,
                  price: coinData.usd,
                  change24h: coinData.usd_24h_change,
                  marketCap: coinData.usd_market_cap,
                  volume24h: coinData.usd_24h_vol,
                  timestamp: Date.now() / 1000
                });
              }
            } catch (error) {
              console.error('Polling Error:', error);
            }
          }
        }, 30000);

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            clearInterval(pollInterval);
        };
    }, [connect, isConnected, coinId]);

    return {
        price,
        trades,
        ohlcv,
        isConnected
    };
};