export default function TimeFormater(timeString) {
    return new Date(timeString).toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit'
    })
}