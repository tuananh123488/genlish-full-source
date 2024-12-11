const handleSRTFile = (str) => {
    const arr = str.split('\n')
    const subtitles = []
    let subtitle = { id: 0, firstTime: 0, lastTime: 0, content: '' }
    arr.forEach((item1, index) => {
        const item = item1
        if (/[0-9]{1,6}/.test(item) && !item.includes(' --> ')) { // id
            // const i = parseInt(JSON.parse(JSON.stringify(item.replace('\r', ''))))
            // if (i === NaN) {
            //     subtitle.id = subtitles.length + 1
            // } else {
            //     subtitle.id = i
            // }
            subtitle.id = subtitles.length + 1
        } else if (item.includes(' --> ')) { // time
            const times = item.split(' --> ')
            times.forEach((time, index) => {
                if (index == 0) {
                    const first = timeStringToSeconds(time)
                    subtitle.firstTime = first
                } else {
                    const last = timeStringToSeconds(time)
                    subtitle.lastTime = last
                }
            })
        } else if (/[A-ZÀ-Ỹa-zà-ỹ0-9]+/.test(item.replace('- ', '')) && !item.includes(' --> ')) {
            subtitle.content += (' ' + item.replace('\r', '').replace('<i>', '').replace('</i>', ''))
        } else if (item === '') {
            if (subtitle.id !== 0) {
                subtitles.push(subtitle)
                subtitle = { id: 0, firstTime: 0, lastTime: 0, content: '' }
            }
        }

    })
    return subtitles;
}

const timeStringToSeconds = (timeString) => {
    const milisecond = parseFloat('0.' + timeString.split(',')[1])
    const [hours, minutes, seconds] = timeString.split(':').map(parseFloat);
    return hours * 3600 + minutes * 60 + seconds + milisecond;
};

module.exports = {
    handleSRTFile
};