# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y wget apt-transport-https software-properties-common

# Add Microsoft repository
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

# Install .NET 8 SDK and Runtime
sudo apt update
sudo apt install -y dotnet-sdk-8.0 aspnetcore-runtime-8.0

# Verify installation
dotnet --version
