window.onInit = onInit
const gElContainer = document.querySelector('.animation-window')
var gImgs = []

function onInit() {
    const elBtn = document.querySelector('.btn-plus')
    elBtn.addEventListener('change', onUploadImg)
}

async function onUploadImg(ev) {
    try {
        const img = await uploadImg(ev)
        gImgs.push(img)
        img.elImg.style.position = 'absolute'
        img.elImg.style.top = getRandomIntInclusive(0, (gElContainer.clientHeight - 100)) + 'px'
        img.elImg.style.left = getRandomIntInclusive(0, (gElContainer.clientWidth - 100)) + 'px'
        img.elImg.addEventListener('click', () => onImgSelect(null, img.id))
    } catch (err) {
        console.error(err)
    }
}

async function uploadImg(ev) {
    const CLOUD_NAME = 'dbizr9cxa'
    const UPLOAD_PRESET = 'ai-junk-ex'
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`
    const FORM_DATA = new FormData()

    FORM_DATA.append('file', ev.target.files[0])
    FORM_DATA.append('upload_preset', UPLOAD_PRESET)

    try {
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: FORM_DATA
        })
        const elImg = document.createElement('img')
        const { url } = await res.json()
        elImg.src = url
        gElContainer.append(elImg)
        const img = {
            id: makeId(),
            elImg
        }
        return img
    } catch (err) {
        console.error(err)
    }
}

function onImgSelect(ev = null, imgId) {
    gImgs.forEach(img => {
        if (img.id === imgId) {
            img.elImg.classList.toggle('active')
        } else img.elImg.classList.remove('active')
    })
    window.addEventListener('keydown', ev => onMoveImage(ev, imgId))
}

function onMoveImage(ev, imgId) {
    const img = gImgs.find(img => img.id === imgId)
    if (img.elImg.className === 'active') {
        switch (ev.key) {
            case 'ArrowUp':
                if (parseInt(img.elImg.style.top) > 0) img.elImg.style.top = parseInt(img.elImg.style.top) - 5 + 'px'
                else return
                break
            case 'ArrowDown':
                if (parseInt(img.elImg.style.top) < (gElContainer.clientHeight - 100)) img.elImg.style.top = parseInt(img.elImg.style.top) + 5 + 'px'
                else return
                break
            case 'ArrowLeft':
                if (parseInt(img.elImg.style.left) > 0) img.elImg.style.left = parseInt(img.elImg.style.left) - 5 + 'px'
                else return
                break
            case 'ArrowRight':
                if (parseInt(img.elImg.style.left) < (gElContainer.clientWidth - 100)) img.elImg.style.left = parseInt(img.elImg.style.left) + 5 + 'px'
                else return
                break
        }
    }
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}

function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
