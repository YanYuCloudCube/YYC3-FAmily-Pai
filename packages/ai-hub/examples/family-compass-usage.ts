/**
 * @file Family Compass 使用示例
 * @description 演示如何使用 FamilyCompass 时钟罗盘系统
 * @author YYC³ AI Team
 * @version 1.0.0
 */

import {
  createFamilyCompass,
  getAllPersonas,
  getNextDutyMember,
  getPersonaByHour
} from '../src/family-compass/index';

function main() {
  console.log('🧭 YYC³ Family Compass 示例\n');

  const compass = createFamilyCompass();

  const state = compass.getCompassState();
  console.log('📍 当前罗盘状态:');
  console.log(`   当前值班: ${state.activeMemberId}`);
  console.log(`   下一位: ${state.nextMemberId}`);
  console.log(`   在线成员: ${state.onlineMembers.join(', ')}`);
  console.log(`   日进度: ${(state.dayProgress * 100).toFixed(1)}%`);
  console.log(`   中心消息: ${state.centerMessage}`);

  console.log('\n👤 所有家人人设:');
  const personas = getAllPersonas();
  for (const persona of personas) {
    console.log(`   ${persona.name} (${persona.id}): ${persona.title}`);
  }

  console.log('\n🕐 按小时查询值班:');
  for (const hour of [7, 10, 12, 15, 18, 21]) {
    const member = getPersonaByHour(hour);
    console.log(`   ${hour}:00 → ${member.name} (${member.title})`);
  }

  const nextMember = getNextDutyMember(new Date().getHours());
  console.log(`\n➡️  下一位值班: ${nextMember.name}`);

  console.log('\n📋 值班表:');
  for (const entry of state.dutyRoster.slice(0, 6)) {
    console.log(`   ${entry.memberId}: ${entry.status}`);
  }
}

main();
