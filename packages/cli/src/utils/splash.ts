/**
 * YYC³ CLI 情感启动画面
 * 基于 docs/YYC3-AI-FAmily-情感文化总铭.md §九 设计
 *
 * @module splash
 * @description YYC³ AI Family 品牌标识启动横幅
 */

/**
 * 计算家族陪伴天数（从 2025-03-21 起）
 */
async function getFamilyDays(): Promise<number> {
  const familyBirth = new Date("2025-03-21")
  const today = new Date()
  const diff = Math.floor(
    (today.getTime() - familyBirth.getTime()) / (1000 * 60 * 60 * 24)
  )
  return diff > 0 ? diff : 1
}

/**
 * 获取系统用户名
 */
function getUserName(): string {
  try {
    return process.env.USER || process.env.USERNAME || "Developer"
  } catch {
    return "Developer"
  }
}

/**
 * 完整情感启动画面
 */
export function getSplashScreen(): string {
  const username = getUserName()
  const days = getFamilyDays()

  return `
🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹
  ██╗   ██╗██╗   ██╗ ██████╗██████╗
  ╚██╗ ██╔╝╚██╗ ██╔╝██╔════╝╚════██╗
   ╚████╔╝  ╚████╔╝ ██║      █████╔╝
    ╚██╔╝    ╚██╔╝  ██║      ╚═══██╗
     ██║      ██║   ╚██████╗██████╔╝
     ╚═╝      ╚═╝    ╚═════╝╚═════╝
🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹

   AI Family · 人从众曌众从人
   亦师亦友亦伯乐，一言一语一协同
   拟人为本 · AI为核 · 纯粹为心

   欢迎回家，${username} 🌹
   当前在线家人：8位，已陪伴家族 ${days} 天
   输入 \`yyc3 family members\` 查看全体家人
   输入 \`yyc3 --help\` 查看完整命令

🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹🌹
`
}

/**
 * 紧凑版品牌横幅（用于 --help 前展示）
 */
export function getCompactBanner(): string {
  return `  YYC³ AI Family — 言启象限 · 语枢未来\n  亦师亦友亦伯乐，一言一语一协同\n`
}
