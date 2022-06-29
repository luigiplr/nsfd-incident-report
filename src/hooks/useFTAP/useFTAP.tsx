import { EventEmitter } from 'eventemitter3';
import { useCallback, useState } from 'react';
import useWebSocket from 'react-use-websocket';
import type { Unit } from './useFTAP.types';
import { parseMessageData, FIREHALL, sub } from './useFTAP.utils';
import { Dictionary, keyBy } from 'lodash'

const callbackEmitter = new EventEmitter()
let currentCBIndex = 1

export const useFTAP = () => {
    const [units, updateUnits] = useState<Dictionary<Unit>>()
    const [currentIncident, updateCurrentIncidentData] = useState<any>({})
    const [currentResponders, updateResponders] = useState<Unit[]>([])

    const { sendMessage } = useWebSocket(`wss://${FIREHALL}.wrserver.app/websocket`, {
        shouldReconnect: () => false,
        onMessage: (message: MessageEvent) => {
            let data = parseMessageData(message)

            if (!data) return

            if (data?.callbackID) {
                callbackEmitter.emit(`cb:${data?.callbackID}`, data)
            }

            if (data?.event) {
                data = data.event

                console.log(data)

                switch (data.type) {
                    case 'responding2':
                        if (data.isNowResponding === false) {
                            updateResponders(currentResponders.filter(({ id }) => id !== data.id))
                        } else if (!currentResponders.some((responder) => responder.id === data.id)) {
                            updateResponders([...currentResponders, data])
                        }
                        break
                    case 'responsecancelled':
                        updateResponders(currentResponders.filter(({ id }) => id !== data.userID))
                        break
                }
            }
        },
        onOpen: () => {
            // sendMessage(`:api:{"module":"devices","method":"$registerFTAPDevice","params":{"hwid":"2692868693653407","devicePin":"${DEVICE_PIN}"},"id":0}`)

            sendCommandWithCallback('{"module":"whosresponding","method":"$getCurrentIncidentData","params":{},"id":4}', ({ responders, ...currentIncident }) => {
                updateCurrentIncidentData(currentIncident)

                const incomingResponders = responders.filter((respnder: Unit) => {
                    return respnder?.destination?.codeName !== 'STAND_DOWN' && !currentResponders.some(({ id }) => id === respnder.id)

                })

                if (incomingResponders.length > 0) {
                    updateResponders([...incomingResponders, ...currentResponders])
                }
            })
            sendCommandWithCallback('{"module":"whosresponding","method":"getAccountManagerData","params":{},"id":3}', ({ users }) => {
                updateUnits(keyBy(users as { [key: string]: Unit }, 'id'))
            })

            sub(sendMessage) // SUB TO INCIDENT CHANGES
        }
    });

    const sendCommandWithCallback = useCallback((command: string, callback?: (data: any) => void) => {
        if (currentCBIndex >= 100) currentCBIndex = 0

        const cbIndex = currentCBIndex++

        if (callback) {
            callbackEmitter.once(`cb:${cbIndex}`, (data) => callback(data))
        }

        sendMessage(`:api:${JSON.stringify({ ...JSON.parse(command.replace(':api:', '')), id: cbIndex })}`)
    }, [sendMessage])

    return {
        units,
        currentIncident,
        responders: currentResponders
    }
}
