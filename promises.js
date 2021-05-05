const start = Date.now()
const body = document.querySelector('body')
body.addEventListener('click', () => {
    body.style.background = 'pink'
    const s = new Date().getSeconds()
    while (true) {
        if (new Date().getSeconds() - s >= 2) {
            console.log('2 seconds!')
            break
        }
    }
})

const startH1 = document.createElement('h1')
startH1.innerText = `Started: ${start}`
body.appendChild(startH1)

const timer = setTimeout(() => {
    const complete = Date.now()
    const timerH1 = document.createElement('h1')
    timerH1.innerText = `Complete: ${complete}, Diff: ${complete - start}`
    body.appendChild(timerH1)
}, 25)

// const getter = () => {
//     fetch('https://daisywheel.herokuapp.com/edit/articles/91')
//         .then(res => res.json())
//         .then(res => {
//             const time = Date.now()
//             const articleTitle = document.createElement('h1')
//             console.log(res)
//             articleTitle.innerText = `${res.article.title} ${time} Diff: ${time-start}`
//             body.appendChild(articleTitle)
//         })
// }

// getter()

const getData = async () => {
    const response = await fetch('https://daisywheel.herokuapp.com/edit/articles/91').then(res => res.json())
    console.log(response)
}

getData()

const waster = () => {
    let sum = 0
    for (let i = 0; i < 666666666; i++) {
        sum += i % 7
    }
    return sum
}

const resulter = () => {
    const sumH1 = document.createElement('h1')
    waster()
    sumH1.innerText = `Dumb Sum: ${waster()} (Time: ${Date.now()})`
    body.appendChild(sumH1)
}

resulter()

const syncer = async () => {
    return 12
}

let globalAnswer

const waiter = async () => {
    const answer = await syncer()
    console.log(answer)
    return answer
}

console.log(syncer())
console.log(waiter())

// const allGetter = async () => {
//     const double = await Promise.all([fetch('https://daisywheel.herokuapp.com/edit/articles/91'), fetch('https://daisywheel.herokuapp.com/edit/articles/89')])
//     console.log(double)
// }

// allGetter()
