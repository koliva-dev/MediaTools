const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const hangupButton = document.getElementById('hangupButton');

let localStream;
let pc1;
let pc2;

const servers = {
    iceServers: [
        {
            urls: 'turn:<YOUR_DOMAIN_OR_IP>:3478',
            username: '<YOUR_USERNAME>',
            credential: '<YOUR_SECRET_KEY>'
        }
    ]
};

startButton.onclick = start;
callButton.onclick = call;
hangupButton.onclick = hangup;

function start() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
            localVideo.srcObject = stream;
            localStream = stream;
        })
        .catch(error => console.error('Error accessing media devices.', error));
}

function call() {
    const configuration = servers;
    pc1 = new RTCPeerConnection(configuration);
    pc2 = new RTCPeerConnection(configuration);

    pc1.onicecandidate = e => onIceCandidate(pc1, e);
    pc2.onicecandidate = e => onIceCandidate(pc2, e);

    pc2.ontrack = e => remoteVideo.srcObject = e.streams[0];

    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));

    pc1.createOffer().then(offer => {
        pc1.setLocalDescription(offer);
        pc2.setRemoteDescription(offer);
        return pc2.createAnswer();
    }).then(answer => {
        pc2.setLocalDescription(answer);
        pc1.setRemoteDescription(answer);
    });
}

function onIceCandidate(pc, event) {
    const otherPc = (pc === pc1) ? pc2 : pc1;
    otherPc.addIceCandidate(event.candidate)
        .catch(e => console.error('Error adding ICE candidate:', e));
}

function hangup() {
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;
}
