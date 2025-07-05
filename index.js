// WhatsApp Bot AutoSender Final Version
const { default: makeWASocket, useMultiFileAuthState, delay } = require('@whiskeysockets/baileys')
const fs = require('fs-extra')
const chalk = require('chalk')
const qrcode = require('qrcode-terminal')
const os = require('os')
const moment = require('moment-timezone')
const { validateNumber } = require('./utils/validate')
const { logSuccess, logFailed } = require('./utils/logger')

// File penyimpanan owner
const OWNER_FILE = 'owners.json'
if (!fs.existsSync(OWNER_FILE)) fs.writeFileSync(OWNER_FILE, JSON.stringify(['62895347034807@s.whatsapp.net'], null, 2))

function tampilMenu() {
    const uptime = process.uptime()
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = Math.floor(uptime % 60)
    const waktu = moment().tz('Asia/Jakarta').format('dddd, DD MMMM YYYY HH:mm:ss')
    const sistem = `${os.type()} (${os.platform()} ${os.arch()})`

    return `
┌─────[ *📋 MENU AUTOSENDER* ]
│ 🏢 *PT Pilar Legal Utama*
│ 👨‍💻 Dibuat oleh: *masdav*
│ 📱 Instagram: @d4vrk_
├───────────────────────
│ 📅 Tanggal: *${waktu}*
│ 💻 Sistem: *${sistem}*
│ ⏱️ Aktif: *${hours}j ${minutes}m ${seconds}d*
├───────────────────────
│ ✏️ *Perintah Bot:*
│  • .menu ➜ Tampilkan menu
│  • .updatepesan <teks>
│  • .updateno <628xxx,...>
│  • .mulai ➜ Kirim pesan
│  • .getidgroup ➜ Ambil ID grup
│  • .getmembergroup <id> ➜ Ambil nomor anggota grup
│
│ 👑 *Owner Control:*
│  • .listowner ➜ Lihat owner
│  • .addowner <628xxx>
│  • .delowner <628xxx>
└───────────────────────
`.trim()
}

function getTextFromMessage(message) {
    const m = message.message
    return m?.conversation ||
        m?.extendedTextMessage?.text ||
        m?.imageMessage?.caption ||
        m?.videoMessage?.caption ||
        m?.documentMessage?.caption ||
        ''
}

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth')
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false
    })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('connection.update', ({ connection, qr }) => {
        if (qr) {
            console.clear()
            console.log(chalk.cyan('📲 Silakan scan QR berikut untuk login:'))
            qrcode.generate(qr, { small: true })
        }
        if (connection === 'open') {
            console.log(chalk.green('✅ Bot berhasil terhubung ke WhatsApp'))
        }
        if (connection === 'close') {
            console.log(chalk.red('❌ Terputus... mencoba ulang'))
            connectToWhatsApp()
        }
    })

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0]
        if (!msg.message || msg.key.fromMe) return

        const sender = msg.key.remoteJid
        const text = getTextFromMessage(msg).trim()
        const owners = JSON.parse(fs.readFileSync(OWNER_FILE))

        if (!owners.includes(sender)) return

        if (text.startsWith('.menu')) {
            await sock.sendMessage(sender, { text: tampilMenu() })
        } else if (text.startsWith('.updatepesan')) {
            const isi = text.replace('.updatepesan', '').trim()
            if (!isi) return sock.sendMessage(sender, { text: '❌ Format salah. Contoh:\n.updatepesan Halo dunia!' })
            fs.writeFileSync('pesan.txt', isi)
            await sock.sendMessage(sender, { text: `✅ *Pesan berhasil diupdate* (${isi.length} karakter)` })
        } else if (text.startsWith('.updateno')) {
            const isi = text.replace('.updateno', '').trim()
            const list = isi.split(',').map(n => n.trim()).filter(validateNumber)
            if (!list.length) return sock.sendMessage(sender, { text: '❌ Tidak ada nomor valid.' })
            fs.writeFileSync('nomor.txt', list.join('\n'))
            await sock.sendMessage(sender, { text: `✅ ${list.length} nomor disimpan.` })
        } else if (text === '.mulai') {
            await sock.sendMessage(sender, { text: '🚀 Mengirim pesan... Harap tunggu.' })
            await jalankanPengiriman(sock, sender)
        } else if (text.startsWith('.addowner')) {
            const no = text.replace('.addowner', '').trim().replace(/\D/g, '')
            if (!validateNumber(no)) return sock.sendMessage(sender, { text: '❌ Nomor tidak valid.' })
            const jid = no + '@s.whatsapp.net'
            if (!owners.includes(jid)) {
                owners.push(jid)
                fs.writeFileSync(OWNER_FILE, JSON.stringify(owners, null, 2))
                await sock.sendMessage(sender, { text: `✅ Nomor ${no} ditambahkan sebagai pemilik.` })
            } else {
                await sock.sendMessage(sender, { text: `ℹ️ Nomor ${no} sudah terdaftar sebagai pemilik.` })
            }
        } else if (text.startsWith('.delowner')) {
            const no = text.replace('.delowner', '').trim().replace(/\D/g, '')
            const jid = no + '@s.whatsapp.net'
            if (owners.includes(jid)) {
                const filtered = owners.filter(o => o !== jid)
                fs.writeFileSync(OWNER_FILE, JSON.stringify(filtered, null, 2))
                await sock.sendMessage(sender, { text: `🗑️ Nomor ${no} telah dihapus dari owner.` })
            } else {
                await sock.sendMessage(sender, { text: `❌ Nomor ${no} tidak ditemukan di daftar owner.` })
            }
        } else if (text === '.listowner') {
            const list = owners.map(o => o.split('@')[0]).join(', ')
            await sock.sendMessage(sender, { text: `📄 *Daftar Pemilik Bot:*\n\n${list}` })
        } else if (text === '.getidgroup') {
            const groups = await sock.groupFetchAllParticipating()
            const result = Object.values(groups).map(g => `• ${g.subject} = ${g.id}`).join('\n')
            await sock.sendMessage(sender, { text: `📦 *Daftar Grup:*\n\n${result}` })
        } else if (text.startsWith('.getmembergroup')) {
            const id = text.replace('.getmembergroup', '').trim()
            if (!id.endsWith('@g.us')) {
                return sock.sendMessage(sender, { text: '❌ Format salah.\nContoh:\n.getmembergroup 1234567890-123456@g.us' })
            }
            try {
                const meta = await sock.groupMetadata(id)
                const members = meta.participants.map(p => p.id.replace(/@.*/, '')).join(', ')
                await sock.sendMessage(sender, {
                    text: `👥 *Anggota Grup: ${meta.subject}*\n\n${members}`
                })
            } catch (e) {
                await sock.sendMessage(sender, { text: '❌ Gagal mengambil data. Pastikan bot masih berada di grup tersebut.' })
            }
        }
    })
}

async function jalankanPengiriman(sock, dari) {
    const pesan = fs.readFileSync('pesan.txt', 'utf-8').trim()
    const daftar = fs.readFileSync('nomor.txt', 'utf-8').split('\n').map(n => n.trim()).filter(validateNumber)

    let suksesList = [], gagalList = []
    fs.ensureDirSync('logs')
    fs.writeFileSync('logs/success.txt', '')
    fs.writeFileSync('logs/failed.txt', '')

    for (let i = 0; i < daftar.length; i++) {
        const nomor = daftar[i]
        const jid = nomor.replace(/\D/g, '') + '@s.whatsapp.net'

        try {
            await sock.sendMessage(jid, { text: pesan })
            logSuccess(nomor)
            suksesList.push(nomor)
        } catch {
            logFailed(nomor)
            gagalList.push(nomor)
        }

        if ((i + 1) % 5 === 0 && i + 1 < daftar.length) await delay(180000)
        else await delay(800)
    }

    const ringkasan = `📦 *Pengiriman Selesai!*\n\n✅ *Sukses:* ${suksesList.length}\n❌ *Gagal:* ${gagalList.length}\n📁 Log disimpan di folder *logs/*`
    await sock.sendMessage(dari, { text: ringkasan })

    let detail = `📋 *Rekap Detail*\n\n`
    if (suksesList.length) detail += `✅ *Berhasil:*\n${suksesList.map((n, i) => `${i + 1}. ${n}`).join('\n')}\n\n`
    if (gagalList.length) detail += `❌ *Gagal:*\n${gagalList.map((n, i) => `${i + 1}. ${n}`).join('\n')}`

    await sock.sendMessage(dari, { text: detail.slice(0, 4096) })
}

connectToWhatsApp()
