import { getRandomInt, shuffleArray } from "./other"

export const questionType = [
    'Xin chào là gì trong tiếng Anh loại 1',
    'Xin chào là gì trong tiếng Anh loại 2',
    'Đọc Tiếng Anh chọn 1 trong 3 tiếng Anh và có kết quả hiện tiếng việt',
    'Nối các câu'
]

//Xin chào là gì trong tiếng Anh loại 1
export const question1 = (vocabularies) => {
    const arr = []
    while (arr.length < 3) {
        const r = getRandomInt(0, Math.floor(vocabularies.length / 2))
        if (!arr.includes(r))
            arr.push(r)
    }
    const vocabulary = {
        english: vocabularies[arr[0]].split(':')[0],
        vietnamese: vocabularies[arr[0]].split(':')[1]
    }
    const false1 = vocabularies[arr[1]].split(':')[0]
    const false2 = vocabularies[arr[2]].split(':')[0]
    return {
        question: `${vocabulary.vietnamese}`,
        options: shuffleArray([vocabulary.english, false1, false2]),
        answer: vocabulary.english,
        display: vocabulary,
        type: 0
    }
}

//Xin chào là gì trong tiếng Anh loại 2
export const question2 = (vocabularies) => {
    const arr = []
    while (arr.length < 3) {
        const r = getRandomInt(Math.floor(vocabularies.length / 2) + 1, vocabularies.length - 1)
        if (!arr.includes(r))
            arr.push(r)
    }
    const vocabulary = {
        english: vocabularies[arr[0]].split(':')[0],
        vietnamese: vocabularies[arr[0]].split(':')[1]
    }
    const false1 = vocabularies[arr[1]].split(':')[0]
    const false2 = vocabularies[arr[2]].split(':')[0]
    return {
        question: `${vocabulary.vietnamese}`,
        options: shuffleArray([vocabulary.english, false1, false2]),
        answer: vocabulary.english,
        display: vocabulary,
        type: 0
    }
}


// Đọc Tiếng Anh chọn 1 trong 3 tiếng Anh và có kết quả hiện tiếng việt
export const question3 = (vocabularies) => {
    const arr = []
    while (arr.length < 3) {
        const r = getRandomInt(0, vocabularies.length - 1)
        if (!arr.includes(r))
            arr.push(r)
    }
    const vocabulary = {
        english: vocabularies[arr[0]].split(':')[0],
        vietnamese: vocabularies[arr[0]].split(':')[1]
    }
    const false1 = vocabularies[arr[1]].split(':')[0]
    const false2 = vocabularies[arr[2]].split(':')[0]
    const options = shuffleArray([vocabulary.english, false1, false2])
    const answer = vocabulary.english
    const question = vocabulary
    return {
        answer,
        question,
        options,
        display: vocabulary,
        type: 1
    }
}


// Nối các câu
export const question4 = (vocabularies) => {
    let arr = []
    while (arr.length < 4) {
        const r = getRandomInt(0, vocabularies.length - 1)
        if (!arr.includes(r))
            arr.push(r)
    }
    arr = arr.map(item => {
        return {
            english: vocabularies[item].split(':')[0],
            vietnamese: vocabularies[item].split(':')[1]
        }
    })
    return {
        question: `Nối các câu khớp nghĩa với nhau`,
        vocabularies: arr,
        type: 2,
        answer: arr.map(item => `${item.english}-${item.vietnamese}`).join('/')
    }
}

// Can you ___ me? |  who i am
export const question5 = (vocabularies) => {
    let arr = []
    while (arr.length < 2) {
        const r = getRandomInt(0, vocabularies.length - 1)
        if (!arr.includes(r) && vocabularies[r].split(':')[0].split(' ').length > 1)
            arr.push(r)
    }
    arr = arr.map(item => {
        return {
            english: vocabularies[item].split(':')[0],
            vietnamese: vocabularies[item].split(':')[1]
        }
    })
    const indexRemove = getRandomInt(0, arr[0].english.split(' ').length = 1)
    const answer = arr[0].english.split(' ')[indexRemove]
    const question = arr[0].english.replace(answer, '___')
    const options = shuffleArray([...arr[1].english.split(' ').filter(item => item !== answer), answer]);

    return {
        answer,
        question,
        options,
        display: arr[0],
        type: 3
    }
}

// Viết lại câu bằng tiếng việt (sắp xếp)
// coffee and water
// ["cà","trà","phê","đường","và","nước"]
export const question6 = (vocabularies) => {
    let selectedIndices = [];
    while (selectedIndices.length < 4) {
        const randomIndex = getRandomInt(
            0,
            vocabularies.length - 1
        );
        if (!selectedIndices.includes(randomIndex))
            selectedIndices.push(randomIndex);
    }
    selectedIndices = selectedIndices.map((item) => {
        return {
            english: vocabularies[item].split(":")[0],
            vietnamese: vocabularies[item].split(":")[1],
        };
    });
    const question = selectedIndices[1].english;
    const answer = selectedIndices[1].vietnamese;
    const options = shuffleArray([
        ...selectedIndices[1].vietnamese.split(" "),
        ...selectedIndices[0].vietnamese.split(" "),
        ...selectedIndices[2].vietnamese.split(" "),
    ]);
    return {
        question: `${question}`,
        answer: answer,
        options: options,
        display: selectedIndices[1],
        type: 4,
    };
};

// đề tiếng anh tự ghi câu trả lời tiếng việt
export const question7 = (vocabularies) => {
    const arr = []
    while (arr.length < 3) {
        const r = getRandomInt(0, Math.floor(vocabularies.length / 2))
        if (!arr.includes(r))
            arr.push(r)
    }
    const vocabulary = {
        english: vocabularies[arr[0]].split(':')[0],
        vietnamese: vocabularies[arr[0]].split(':')[1]
    }
    return {
        question: `${vocabulary.vietnamese}`,
        type: 5,
        answer: vocabulary.english,
        display: vocabulary
    }
}

// đề tiếng việt tự ghi câu trả lời tiếng anh
export const question8 = (vocabularies) => {
    const arr = []
    while (arr.length < 3) {
        const r = getRandomInt(0, Math.floor(vocabularies.length / 2))
        if (!arr.includes(r))
            arr.push(r)
    }
    const vocabulary = {
        english: vocabularies[arr[0]].split(':')[0],
        vietnamese: vocabularies[arr[0]].split(':')[1]
    }
    return {
        question: `${vocabulary.english}`,
        type: 6,
        answer: vocabulary.vietnamese,
        display: vocabulary
    }
}

export const pronounces = [
    {
        name: 'David US',
        voiceName: 'Microsoft David - English (United States)',
        image: '/EN.png'
    },
    {
        name: 'Mark US',
        voiceName: 'Microsoft Mark - English (United States)',
        image: '/EN.png'
    },
    {
        name: 'Zira US',
        voiceName: 'Microsoft Zira - English (United States)',
        image: '/EN.png'
    },
    {
        name: 'Google US',
        voiceName: 'Google US English',
        image: '/EN.png'
    },
    {
        name: 'Google UK Male',
        voiceName: 'Google UK English Male',
        image: '/EN.png'
    },
    {
        name: 'Google UK Female',
        voiceName: 'Google UK English Female',
        image: '/EN.png'
    }
]