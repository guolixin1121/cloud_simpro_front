export VERSION='0.27' 

docker login -u guohuang@saimo.ai@151 -p Gh19850506 registry-vecps-ns.gaccloud.com.cn 
docker tag cloud_simpro_front registry-vecps-ns.gaccloud.com.cn/tenant-eaws/cloud_simpro_front:${VERSION} 
docker push registry-vecps-ns.gaccloud.com.cn/tenant-eaws/cloud_simpro_front:${VERSION}