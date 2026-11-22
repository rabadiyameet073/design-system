import { auditSemanticContrast, autoFixSemantic, nudgeToContrast } from '../../src/tokens/contrastEngine.ts';
const bad:any = { bgDefault:'#FFFFFF', bgSurface:'#F5F5F5', bgElevated:'#FFFFFF', fgDefault:'#999999', fgMuted:'#BBBBBB',
 borderDefault:'#EEEEEE', actionPrimary:'#7799CC', actionPrimaryFg:'#FFFFFF', actionPrimaryHover:'#6688BB', focusRing:'#DDDDDD',
 statusSuccess:'#0a0', statusSuccessBg:'#E6FFE6', statusSuccessFg:'#88CC88', statusWarning:'#fa0', statusWarningBg:'#FFF3CC', statusWarningFg:'#DDCC66',
 statusDanger:'#f00', statusDangerBg:'#FFE5E5', statusDangerFg:'#FF9999', statusInfo:'#06f', statusInfoBg:'#E5F0FF', statusInfoFg:'#99BBFF' };
const before = auditSemanticContrast(bad); const fixed = autoFixSemantic(bad); const after = auditSemanticContrast(fixed);
console.log('BEFORE fail', before.failCount,'/',before.totalCount,' AFTER fail', after.failCount,'/',after.totalCount);
console.log('action label fixed:', bad.actionPrimaryFg,'->',fixed.actionPrimaryFg,' | fgDefault:',bad.fgDefault,'->',fixed.fgDefault);
console.log('still failing:', after.issues.filter(i=>!i.passed).map(i=>i.id+':'+i.ratio));
// mid-grey background (old code chose wrong direction)
console.log('mid-grey bg #808080, fg #777777 ->', nudgeToContrast('#777777','#808080',4.5));
