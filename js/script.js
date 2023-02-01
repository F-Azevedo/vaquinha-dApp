// 1. Declare global variable to store the smart contract instance
let DonationContractFactory;
let DonationContract;
var signer;

// 2. Set contract address and ABI
const DonationFactory_Contract_Address = "0x4c38e8c3F7Ee4554fBafa3A2d91aa825F2F05D9c";
const DonationFactory_Contract_ABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "goal",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "createDonation",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "donateByName",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "withdrawByName",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "getBalanceByDonationName",
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
		"name": "getDonationsAddresses",
		"outputs": [
			{
				"internalType": "contract Donation[]",
				"name": "",
				"type": "address[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getDonationsNames",
		"outputs": [
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			}
		],
		"name": "getGoalByDonationName",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

const Donation_Contract_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "goal",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "goal",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "raisedAmount",
				"type": "uint256"
			}
		],
		"name": "GoalReached",
		"type": "event"
	},
	{
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"inputs": [],
		"name": "_factory",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_goal",
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
		"name": "_owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "_raisedAmount",
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
		"name": "getBalance",
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
		"name": "transfer",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "withdraw",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"stateMutability": "payable",
		"type": "receive"
	}
];

const provider = new ethers.providers.Web3Provider(window.ethereum, "goerli");
provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    signer = provider.getSigner(accounts[0]);

    /* 3.1 Create instance of turing smart contract */
    DonationContractFactory = new ethers.Contract(
      DonationFactory_Contract_Address,
      DonationFactory_Contract_ABI,
      signer
    );
  });
});

// Variaveis globais
var donations = [];
var addresses = [];
let donationSelected = -1;
let collectSelected = -1;
// -----------------------------------------------------------------------------------------------

// Template de página vazia

function template_empty() {
	return `
	<div class="container empty">
		<h4>Não existem vaquinhas, adicione uma nova clicando no botão acima</h4>
	</div>
	`;
}

// Template para criação das div's
function template(i, name, atual, meta) {
	var percent = (atual/meta)*100
    return `
    <div id="container_v${i+1}" class="container">
        <div class="container_head">
            <div class="info">
                <h4>${name}</h4>
                <small class="text-muted">Atual: ${atual}</small>
                <small class="text-muted">Meta: ${meta}</small>
            </div>

            <div class="buttons">
                <button id="donate_v${i+1}" type="button" class="btn btn-light">Doar</button>
                <button id="collect_v${i+1}" ${percent < 100 ? 'style="display:none;"' : ""} id="coletar_v${i+1}" type="button" class="btn btn-success">Coletar</button>
            </div>
        </div>
        <br>
        <div class="progress">
            <div class="progress-bar progress-bar-striped bg-success" role="progressbar" style="width: ${percent}%;">${percent}%</div>
        </div>
    </div>`;
}
// -----------------------------------------------------------------------------------------------

// Identifica qual div foi clicada e consequentemente a campanha relacionada.
function identifyDonation(e) {
    $('#modalDoacao').modal('show');
    pos = e.target.id.indexOf("v") + 1;
    donationSelected = parseInt(e.target.id.slice(pos));
}

function collectDonation(e) {
	e.target.innerHTML = "Coletando..";
	e.target.disabled = true;

    pos = e.target.id.indexOf("v") + 1;
    collectSelected = parseInt(e.target.id.slice(pos));

	var name = donations[collectSelected-1];
	DonationContractFactory.withdrawByName(name)
	.catch((err) => {
		alert("Error collecting " + err.message)
	}).finally(() => {
		e.target.innerHTML = "Coletar";
		e.target.disabled = false;
	});

}
// -----------------------------------------------------------------------------------------------

// Faz a doação
const submitDonationButton = document.querySelector("#submitDonationForm");

const donationValue = document.querySelector("#donatedValue");
const donationExpoent = document.querySelector("#selectExpoentDonation");

function resetModalDonate() {
	donationValue.value = 1;
    donationExpoent.value = "0";
	submitDonationButton.innerHTML = "Enviar";
	submitDonationButton.disabled = false;
}

function donateVaquinha() {
    submitDonationButton.innerText = "Enviando...";
    submitDonationButton.disabled = true;

	var name = donations[donationSelected-1];
	var value = donationValue.value;
    var expoent = donationExpoent.value;

	var donated = value+"0".repeat(Number(expoent));

	DonationContractFactory.donateByName(name, {value : donated})
	.catch((err) => {
		alert("Error settin new Donation " + err.message)
	}).finally(() => {
		resetModalDonate();
		$('#modalDoacao').modal('hide');
	});
}

submitDonationButton.addEventListener("click", donateVaquinha)
// -----------------------------------------------------------------------------------------------

// Refresh Page
let wrapper = document.getElementById("wrapper");

function refresh(content) {
    wrapper.innerHTML = content;
    setOnClickListeners()
}
// -----------------------------------------------------------------------------------------------

// Adiciona onClickListeners
function setOnClickListeners() {
    for (let i=0; i < donations.length; i++) {
        var donate = document.querySelector(`#donate_v${i+1}`);
        var collect = document.querySelector(`#collect_v${i+1}`);

        donate.addEventListener("click", identifyDonation);
        collect.addEventListener("click", collectDonation);
    }
}
// -----------------------------------------------------------------------------------------------

const refreshPage = document.querySelector("#refreshPage");
const successAlert = document.querySelector(".alert");

function hideAlert() {
	successAlert.setAttribute('id', 'hide');
}

// Faz o carregamento da página.
async function loadVaquinhas() {
    let content = "";
	refreshPage.innerHTML = "Atualizando";
	refreshPage.disabled = true;

    try {
        donations = await DonationContractFactory.getDonationsNames();
		addresses = await DonationContractFactory.getDonationsAddresses();

		if (donations.length == 0) {
			content = template_empty()
		}

        for (let i=0; i < donations.length; i++) {
            var name = donations[i];
            var atual = await DonationContractFactory.getBalanceByDonationName(name);
            var meta = await DonationContractFactory.getGoalByDonationName(name);
    
			DonationContract = new ethers.Contract(addresses[i], Donation_Contract_ABI, signer);
			DonationContract.removeAllListeners("GoalReached");
			DonationContract.once("GoalReached", (event) => {
				successAlert.removeAttribute("id");
				loadVaquinhas();
				setTimeout(hideAlert, 7000);
			});

            var container = template(i, name, Number(atual._hex), Number(meta._hex));
            content += container;
        }
		refresh(content);
    } catch (err) {
        alert("Error fetching list of names. " + err.message);
    } finally {
		refreshPage.innerHTML = "Atualizar";
		refreshPage.disabled = false;
	}
}

hideAlert();
setTimeout(loadVaquinhas, 500);
setInterval(loadVaquinhas, 10000);
refreshPage.addEventListener("click", loadVaquinhas);
// -----------------------------------------------------------------------------------------------

// Cria uma nova Vaquinha
const creationButton = document.querySelector("#submitCreationForm");

const creationName = document.querySelector("#donationNameCreation");
const creationOwner = document.querySelector("#donationOwnerCreation");
const creationValue = document.querySelector("#donationValueCreation");
const creationExpoent = document.querySelector("#selectExpoentCreation");

function resetModalCriar() {
    creationName.value = "";
	creationOwner.value = "";
    creationValue.value = 1;
    creationExpoent.value = "0";
    creationButton.innerText = "Criar";
    creationButton.disabled = false;
}

function setNewVaquinha() {

    creationButton.innerText = "Enviando...";
    creationButton.disabled = true;

    var name = creationName.value;
    var owner = creationOwner.value;
    var value = creationValue.value;
    var expoent = creationExpoent.value;
    
    if (name == "") {
        alert("Name cannot be empty");
        resetModalCriar();
        return ;
    }

    if (owner == "") {
        alert("Owner cannot be empty");
        resetModalCriar();
        return ;
    }

    var goal = value+"0".repeat(Number(expoent));

	DonationContractFactory.createDonation(name, goal, owner)
	.catch((err) => {
		alert("Error settin new Vaquinha " + err.message)
	}).finally(() => {
		resetModalCriar();
		$('#modalVaquinha').modal('hide');
	});
}

creationButton.addEventListener("click", setNewVaquinha);
// -----------------------------------------------------------------------------------------------