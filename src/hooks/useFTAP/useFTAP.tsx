import { EventEmitter } from 'eventemitter3';
import { useCallback, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import { Firefighter } from './useFTAP.types';
import { parseMessageData, settings, FIREHALL, DEVICE_PIN, sub } from './useFTAP.utils';

const callbackEmitter = new EventEmitter()
let currentCBIndex = 0


export const useFTAP = () => {
    const [online, updateOnlineState] = useState(false)
    const [firefighters, updateFireFighers] = useState<Firefighter[]>([])

    const { sendMessage, lastJsonMessage } = useWebSocket(
        `wss://${FIREHALL}.wrserver.app/websocket`,
        {
            shouldReconnect: () => true,
            onMessage: (message) => {
                const data = parseMessageData(message)

                if (!data) return

                if (data?.app?.displayName && data?.callbackID === 0 && !online) {
                    updateOnlineState(true)
                }

                if (data?.callbackID) {
                    callbackEmitter.emit(`cb:${data?.callbackID}`, data)
                }
            },
            onOpen: () => {
                sendMessage(`:api:{"module":"devices","method":"$registerFTAPDevice","params":{"hwid":"2692868693653407","devicePin":"${DEVICE_PIN}"},"id":0}`)
                sendMessage(`:ret:${JSON.stringify(settings)}`)

                sendCommand('{"module":"whosresponding","method":"$getCurrentIncidentData","params":{},"id":4}', data => {
                    console.log({ settings: data })
                })

                sub(sendMessage) // SUB TO INCIDENT CHANGES
            }
        }
    );

    const sendCommand = (command: string, callback: (data: any) => void) => {
        const cbIndex = currentCBIndex++

        callbackEmitter.once(`cb:${cbIndex}`, (data) => {
            callback(data)
        })

        sendMessage(`:api:${JSON.stringify({ ...JSON.parse(command), id: cbIndex })}`)
    }
}
