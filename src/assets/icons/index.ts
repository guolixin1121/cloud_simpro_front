const iconFiles = import.meta.glob('./*.svg')
const results = {} as Record<string, any>
for(const icon in iconFiles) {
  const iconName = icon.replace(/.\/|.svg/g,'')
  results[iconName] = iconFiles[icon]
}
export default results