// КОНФИГУРАЦИЯ - ЗАМЕНИТЕ НА ВАШИ ДАННЫЕ!
const CONTRACT_ADDRESS = '0x43bB32c2D152a88eA81822Aa132Ee224559AfB72'; // ← ЗАМЕНИТЕ НА РЕАЛЬНЫЙ АДРЕС
const CONTRACT_ABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "count",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creationBlock",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "creationTimestamp",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBlockCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCurrentBlockNumber",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getNet",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTimeAfter",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// Глобальные переменные
let contract;
let provider;
let signer;

// Элементы DOM
const elements = {
    contractAddress: document.getElementById('contractAddress'),
    currentAccount: document.getElementById('currentAccount'),
    network: document.getElementById('network'),
    countValue: document.getElementById('countValue'),
    currentBlock: document.getElementById('currentBlock'),
    blockCount: document.getElementById('blockCount'),
    timeAfter: document.getElementById('timeAfter'),
    networkId: document.getElementById('networkId'),
    creationBlock: document.getElementById('creationBlock'),
    creationTime: document.getElementById('creationTime')
};

// Кнопки
const buttons = {
    incrementButton: document.getElementById('incrementButton'),
    getCountButton: document.getElementById('getCountButton'),
    getBlockButton: document.getElementById('getBlockButton'),
    getBlockCountButton: document.getElementById('getBlockCountButton'),
    getTimeButton: document.getElementById('getTimeButton'),
    getNetButton: document.getElementById('getNetButton'),
    getCreationDataButton: document.getElementById('getCreationDataButton')
};

// Инициализация приложения
async function initApp() {
    // Проверка MetaMask
    if (!window.ethereum) {
        alert('Пожалуйста, установите MetaMask!');
        return;
    }
    
    try {
        // Подключаемся к MetaMask
        provider = new ethers.providers.Web3Provider(window.ethereum);
        
        // Запрашиваем аккаунты
        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        // Получаем signer
        signer = provider.getSigner();
        
        // Создаем экземпляр контракта
        contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        
        // Обновляем UI
        updateUI(accounts[0]);
        
        // Назначаем обработчики кнопок
        setupEventListeners();
        
        // Загружаем начальные данные
        await loadInitialData();
        
    } catch (error) {
        console.error('Ошибка инициализации:', error);
        alert(`Ошибка: ${error.message}`);
    }
}

// Обновление UI
function updateUI(account) {
    elements.contractAddress.textContent = CONTRACT_ADDRESS;
    elements.currentAccount.textContent = account ? 
        `${account.substring(0, 6)}...${account.substring(38)}` : 'Не подключен';
    
    // Получаем информацию о сети
    provider.getNetwork().then(network => {
        elements.network.textContent = `${network.name} (ID: ${network.chainId})`;
    });
}

// Назначение обработчиков кнопок
function setupEventListeners() {
    // Увеличить счётчик
    buttons.incrementButton.onclick = async () => {
        try {
            const tx = await contract.increment();
            alert(`Транзакция отправлена! Хэш: ${tx.hash}\nОжидайте подтверждения...`);
            await tx.wait();
            alert('Счётчик увеличен!');
            await getCount();
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        }
    };
    
    // Получить счётчик
    buttons.getCountButton.onclick = getCount;
    
    // Получить текущий блок
    buttons.getBlockButton.onclick = async () => {
        try {
            const blockNumber = await contract.getCurrentBlockNumber();
            elements.currentBlock.textContent = blockNumber.toString();
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        }
    };
    
    // Получить количество блоков
    buttons.getBlockCountButton.onclick = async () => {
        try {
            const blockCount = await contract.getBlockCount();
            elements.blockCount.textContent = blockCount.toString();
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        }
    };
    
    // Получить время
    buttons.getTimeButton.onclick = async () => {
        try {
            const time = await contract.getTimeAfter();
            elements.timeAfter.textContent = `${time.toString()} сек`;
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        }
    };
    
    // Получить ID сети
    buttons.getNetButton.onclick = async () => {
        try {
            const netId = await contract.getNet();
            elements.networkId.textContent = netId.toString();
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        }
    };
    
    // Получить данные создания
    buttons.getCreationDataButton.onclick = async () => {
        try {
            const creationBlock = await contract.creationBlock();
            const creationTime = await contract.creationTimestamp();
            
            elements.creationBlock.textContent = creationBlock.toString();
            
            // Конвертируем timestamp в читаемую дату
            const date = new Date(creationTime.toNumber() * 1000);
            elements.creationTime.textContent = 
                `${creationTime.toString()} (${date.toLocaleString()})`;
        } catch (error) {
            alert(`Ошибка: ${error.message}`);
        }
    };
}

// Загрузка начальных данных
async function loadInitialData() {
    try {
        await getCount();
        await buttons.getBlockButton.onclick();
        await buttons.getBlockCountButton.onclick();
        await buttons.getTimeButton.onclick();
        await buttons.getNetButton.onclick();
        await buttons.getCreationDataButton.onclick();
    } catch (error) {
        console.log('Некоторые данные не загружены:', error.message);
    }
}

// Получить значение счётчика
async function getCount() {
    try {
        const count = await contract.count();
        elements.countValue.textContent = count.toString();
    } catch (error) {
        alert(`Ошибка получения счётчика: ${error.message}`);
    }
}

// Слушатель изменения аккаунта
window.ethereum.on('accountsChanged', (accounts) => {
    updateUI(accounts[0]);
});

// Слушатель изменения сети
window.ethereum.on('chainChanged', () => {
    window.location.reload();
});

// Запуск приложения
initApp();
