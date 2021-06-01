# -------------------------------------------------------------------------------------------------
# 05/21/21      Moorthy Rathinasamy       Initial Version
# -------------------------------------------------------------------------------------------------
#!/bin/bash

BUILD_FILE=integration-nanopay-net-build.sh
MEDIATORS=tools/medusa/integration-nanopay-net
SERVICE_HEALTH_URLS=tools/jenkins/services-integration-nanopay-net

echo '********************************************************************************************'
echo '------------------------------------------- PRE-BUILD  -------------------------------------'
echo '********************************************************************************************'
echo 'Running Pre-build echecks ...'
tools/jenkins/pre_build.sh

echo '********************************************************************************************'
echo '------------------------------------------ BUILD  ------------------------------------------'
echo '********************************************************************************************'
echo 'Running base Build (with -i ) ...'
./build.sh -i
echo 'Running build [' $BUILD_FILE '] ...'
tools/medusa/$BUILD_FILE

echo '********************************************************************************************'
echo '---------------------------------------- POST BUILD  ---------------------------------------'
echo '********************************************************************************************'
echo 'Running Post Build Valiation ...'
tools/jenkins/post_build.sh

echo '********************************************************************************************'
echo '------------------------------------------ PRE-DEPLOY  -------------------------------------'
echo '********************************************************************************************'
echo 'Running Pre-Deploy checks ...'
echo 'Running Mediator(s) & Node(s) Service Status Check ...'
tools/jenkins/pre_deploy.sh $MEDIATORS

echo '********************************************************************************************'
echo '-------------------------------------------- DEPLOY  ---------------------------------------'
echo '********************************************************************************************'
echo 'Running Remote Install/Deploy ...'
tools/jenkins/deploy.sh $MEDIATORS

echo '********************************************************************************************'
echo '----------------------------------------POST-DEPLOY  ---------------------------------------'
echo '********************************************************************************************'
echo 'Waiting three minutes to allow the services & health checks to be fully ready'
sleep 180
echo 'Running Post Deploy Checks ...' 
tools/jenkins/post_deploy.sh $SERVICE_HEALTH_URLS $MEDIATORS

# -------------------------------------------------------------------------------------------------

