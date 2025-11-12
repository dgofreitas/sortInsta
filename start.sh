#!/bin/bash

# Script de inicialização rápida do SortInsta
# Execute: chmod +x start.sh && ./start.sh

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "=================================="
echo "   🎉 SortInsta Quick Start 🎉"
echo "=================================="
echo -e "${NC}"

# Verificar se os arquivos .env existem
if [ ! -f "backend/.env" ]; then
	echo -e "${YELLOW}⚠️  Arquivo backend/.env não encontrado${NC}"
	echo "Criando a partir do exemplo..."
	cp backend/.env.example backend/.env
	echo -e "${RED}❗ Configure backend/.env com suas credenciais antes de continuar!${NC}"
	exit 1
fi

if [ ! -f "frontend/.env" ]; then
	echo -e "${YELLOW}⚠️  Arquivo frontend/.env não encontrado${NC}"
	cp frontend/.env.example frontend/.env
fi

# Verificar se MongoDB está rodando
echo -e "${BLUE}🔍 Verificando MongoDB...${NC}"
if ! pgrep -x "mongod" >/dev/null && ! docker ps | grep -q mongodb; then
	echo -e "${YELLOW}⚠️  MongoDB não está rodando${NC}"
	echo "Você quer iniciar o MongoDB com Docker? (y/n)"
	read -r response
	if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
		echo -e "${BLUE}🐳 Iniciando MongoDB no Docker...${NC}"
		docker run -d -p 27017:27017 --name mongodb mongo:latest
		sleep 3
		if docker ps | grep -q mongodb; then
			echo -e "${GREEN}✓ MongoDB iniciado com sucesso${NC}"
		else
			echo -e "${RED}❌ Erro ao iniciar MongoDB${NC}"
			exit 1
		fi
	else
		echo -e "${RED}❌ MongoDB é necessário para rodar a aplicação${NC}"
		exit 1
	fi
else
	echo -e "${GREEN}✓ MongoDB está rodando${NC}"
fi

# Verificar se node_modules existem
if [ ! -d "backend/node_modules" ]; then
	echo -e "${BLUE}📦 Instalando dependências do backend...${NC}"
	cd backend
	yarn install
	cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
	echo -e "${BLUE}📦 Instalando dependências do frontend...${NC}"
	cd frontend
	yarn install
	cd ..
fi

echo -e "${GREEN}"
echo "=================================="
echo "  ✅ Pronto para iniciar!"
echo "=================================="
echo -e "${NC}"

# Perguntar se quer iniciar em modo desenvolvimento
echo "Deseja iniciar a aplicação agora? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
	echo -e "${BLUE}🚀 Iniciando aplicação...${NC}"
	echo ""
	echo -e "${GREEN}Backend:${NC} http://localhost:5000"
	echo -e "${GREEN}Frontend:${NC} http://localhost:3000"
	echo ""
	echo -e "${YELLOW}Pressione Ctrl+C para parar os servidores${NC}"
	echo ""

	# Iniciar backend e frontend em paralelo
	trap 'kill $(jobs -p)' EXIT

	cd backend && yarn dev &
	BACKEND_PID=$!

	cd ../frontend && yarn dev &
	FRONTEND_PID=$!

	# Aguardar
	wait
else
	echo ""
	echo "Para iniciar manualmente, execute em terminais separados:"
	echo ""
	echo -e "${BLUE}Terminal 1 (Backend):${NC}"
	echo "  cd backend && yarn dev"
	echo ""
	echo -e "${BLUE}Terminal 2 (Frontend):${NC}"
	echo "  cd frontend && yarn dev"
	echo ""
fi
