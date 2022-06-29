import { SendMessage } from "react-use-websocket";

export const FIREHALL = 'northsaanichfire'
export const DEVICE_PIN = '55164044'

export const parseMessageData = (message: MessageEvent) => {
    let data

    if (message.data?.startsWith(':ret:')) {
        data = JSON.parse(message.data.split(':ret:')[1]);
    } else {
        try {
            data = JSON.parse(message.data)
        } catch {
            console.log('unable to parse ws message', message.data)
        }
    }

    return data
}

export const sub = (sendMessage: SendMessage) => {
    // sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.position`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.wratposition`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.wrattrackingstopped`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.responding2`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.responderlimitschanged`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.incidentmessagereceived`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.pagermessagecoordinateschanged`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.responsecancelled`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.responderonduty`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.availabilitychanged`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.dashboardreset`)
    sendMessage(`:sub:${FIREHALL}.wrserver.app.whosresponding.gpsdisabled`)
}

export const settings = {
    "settings": {
        "dashboardTimeout": 1200000,
        "displayOnDutyMembers": true,
        "maxIncidentMessageCount": 30,
        "displayAvailableMembers": true,
        "tvPanels": [],
        "displayNearestWaterSourcess": 0,
        "maxIncidentMessageLength": 1000,
        "units": "METRIC",
        "scrollSpeed": 0,
        "mapZoom": 0,
        "incidentMapZoom": 0,
        "displayUnavailableMembers": true,
        "displayWaterSourceDistance": false,
        "departmentSettings": {},
        "locationSettings": {},
        "maxDispatchMessageLength": 1000,
        "idleRefreshTimeout": 0,
        "mapViewTransitionInterval": 0
    }
}