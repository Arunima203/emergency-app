function sendAlert() {
    const data = {
        message: "Emergency!",
        lat: 22.57,
        lng: 88.36,
        time: new Date().toLocaleTimeString()
    };
    
    // Use the socket you initialized in index.html
    socket.emit('send-location', data); 
    alert("Alert Sent via Socket!");
}