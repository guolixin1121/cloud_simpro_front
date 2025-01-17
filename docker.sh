export CURRENT_TIME="`date '+%Y%m%d%H%M%S'`"
export BUILD_ID=0
export VERSION="build-${BUILD_ID}-${CURRENT_TIME}"
docker rmi $(docker images | grep "/tenant-eaws/cloud_simpro_front" | awk '{print $3}') -f
docker build -t cloud_simpro_front .
# docker save cloud_simpro_front > cloud_simpro_front.tar
docker login -u guohuang@saimo.ai@151 -p Gh19850506 registry-vecps-ns.gaccloud.com.cn
docker tag cloud_simpro_front registry-vecps-ns.gaccloud.com.cn/tenant-eaws/cloud_simpro_front:${VERSION}
docker push registry-vecps-ns.gaccloud.com.cn/tenant-eaws/cloud_simpro_front:${VERSION}
