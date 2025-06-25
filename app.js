// Kiểm tra xem MetaMask đã cài đặt chưa
if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask to use this DApp!');
} else {
    console.log('MetaMask is installed!');
}

let web3;
let userAddress;

document.getElementById('connectButton').addEventListener('click', connectWallet);

async function connectWallet() {
    try {
        // Yêu cầu kết nối tài khoản
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userAddress = accounts[0];
        
        // Hiển thị địa chỉ ví
        const walletAddressElement = document.getElementById('walletAddress');
        walletAddressElement.textContent = `Connected: ${userAddress}`;
        walletAddressElement.classList.remove('hidden');
        
        // Hiển thị chức năng DApp
        document.querySelector('.dapp-functions').classList.remove('hidden');
        
        // Khởi tạo Web3
        web3 = new Web3(window.ethereum);
        
        console.log('Connected to wallet:', userAddress);
        
        // Thêm sự kiện cho nút Get Balance
        document.getElementById('getBalance').addEventListener('click', getBalance);
        
    } catch (error) {
        console.error('Error connecting wallet:', error);
    }
}

async function getBalance() {
    if (!web3 || !userAddress) return;
    
    try {
        // Lấy balance (đơn vị wei)
        const balanceWei = await web3.eth.getBalance(userAddress);
        
        // Chuyển đổi từ wei sang ether
        const balance = web3.utils.fromWei(balanceWei, 'ether');
        
        // Hiển thị balance
        document.getElementById('balanceDisplay').textContent = `Balance: ${balance} SOM`;
        
    } catch (error) {
        console.error('Error getting balance:', error);
        document.getElementById('balanceDisplay').textContent = 'Error getting balance';
    }
}
document.getElementById('sendTransaction').addEventListener('click', sendTransaction);

async function sendTransaction() {
    const recipient = prompt("Enter recipient address:");
    if (!recipient) return;
    
    const amount = prompt("Enter amount to send:");
    if (!amount || isNaN(amount)) {
        alert("Invalid amount");
        return;
    }

    try {
        document.getElementById('transactionStatus').textContent = "Processing...";
        
        const tx = {
            from: userAddress,
            to: recipient,
            value: web3.utils.toWei(amount, 'ether')
        };

        const txHash = await web3.eth.sendTransaction(tx);
        document.getElementById('transactionStatus').innerHTML = `
            <p>Transaction successful!</p>
            <p>Hash: ${txHash}</p>
        `;
        
    } catch (error) {
        console.error(error);
        document.getElementById('transactionStatus').textContent = "Transaction failed";
    }
}