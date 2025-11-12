# Scripts de Instalação Automatizada

## install-all.sh (Linux/Mac)
#!/bin/bash

echo "🚀 Instalando SortInsta..."

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar Node.js
if ! command -v node &>/dev/null; then
	echo -e "${RED}❌ Node.js não encontrado. Instale Node.js 18+ primeiro.${NC}"
	exit 1
fi

# echo -e "${GREEN}✓ Node.js encontrado: $(node -v)${NC}"

# Verificar Yarn
if ! command -v yarn &>/dev/null; then
	echo -e "${YELLOW}⚠️  Yarn não encontrado. Instalando...${NC}"
	corepack enable
	corepack prepare yarn@stable --activate
fi

echo -e "${GREEN}✓ Yarn encontrado: $(yarn -v)${NC}"

# # Verificar MongoDB
# if ! command -v mongod &> /dev/null && ! docker ps &> /dev/null; then
#     echo -e "${RED}❌ MongoDB não encontrado. Instale MongoDB ou Docker.${NC}"
#     exit 1
# fi

echo -e "${GREEN}✓ MongoDB/Docker encontrado${NC}"

# Instalar backend
echo -e "${BLUE}📦 Instalando backend...${NC}"
cd backend
yarn install
if [ $? -ne 0 ]; then
	echo -e "${RED}❌ Erro ao instalar backend${NC}"
	exit 1
fi
cp .env.example .env
echo -e "${GREEN}✓ Backend instalado${NC}"

# Instalar frontend
echo -e "${BLUE}📦 Instalando frontend...${NC}"
cd ../frontend
yarn install
if [ $? -ne 0 ]; then
	echo -e "${RED}❌ Erro ao instalar frontend${NC}"
	exit 1
fi
cp .env.example .env
echo -e "${GREEN}✓ Frontend instalado${NC}"

cd ..

echo -e "${GREEN}"
echo "=========================================="
echo "✅ Instalação concluída!"
echo "=========================================="
echo -e "${NC}"
echo "Próximos passos:"
echo ""
echo "1. Configure suas credenciais OAuth:"
echo "   - Edite backend/.env"
echo "   - Adicione suas chaves do Google e Facebook"
echo ""
echo "2. Inicie o MongoDB:"
echo "   docker run -d -p 27017:27017 --name mongodb mongo:latest"
echo ""
echo "3. Inicie a aplicação:"
echo "   Terminal 1: cd backend && yarn dev"
echo "   Terminal 2: cd frontend && yarn dev"
echo ""
echo "4. Acesse: http://localhost:3000"
echo ""
