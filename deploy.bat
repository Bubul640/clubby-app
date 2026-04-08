@echo off
echo.
echo  Deploiement Clubby en cours...
echo.
cd /d "D:\projet\clubby-app"
git add .
git commit -m "Mise a jour Clubby"
git push
echo.
echo  Done ! Vercel redéploie en ~1 minute.
echo  https://clubby-app.vercel.app
echo.
pause
