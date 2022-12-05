import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context';
import { PageHOC, CustomInput, CustomButton } from '../components';
//import { Contract } from 'ethers';


const Home = () => {
  const { contract, walletAddress, gameData, setShowAlert, setErrorMessage } = useGlobalContext();
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleClick = async () => {
   console.log({contract})
   console.log(contract)
   try{
        //Check if player  exists with (func){} of smartContract
        const playerExists = await contract.isPlayer(walletAddress);
        if(!playerExists){
          console.log("new")
          await contract.registerPlayer(playerName, playerName, {
            gasLimit: 200000
        });
          
          setShowAlert({
            status: true,
            type: 'info',
            message: `${playerName} is being summoned!`
          })
            setTimeout(() => navigate('/create-battle'))
        }
        //  if(playerExists){
        //   console.log("exists yet")
        //   setShowAlert({
        //     status: true,
        //     type: 'failure',
        //     message: `${playerName} already exists please chose another name`
        //   })
        // }
        alert(playerName)
      } catch (error) {
        // setShowAlert({
        //     status: true,
        //     type: 'failure',
        //     message: errorMessage
        // })
        //alert(showAlert);
        setErrorMessage(error)
        
      }
  }

  useEffect(() => {
    const checkForPlayerToken = async () => {
      const playerExists = await contract.isPlayer(walletAddress, {
        gasLimit: 200000
    });
      const playerTokenExists = await contract.isPlayerToken(walletAddress, {
        gasLimit: 200000
    });

      console.log({
        playerExists,
        playerTokenExists
      })

      if(playerExists && playerTokenExists) navigate('/create-battle')
    }
    
    if(contract) checkForPlayerToken();
  }, [contract])
  

  useEffect(() => {
      if(gameData.activeBattle){
          navigate(`/battle/${gameData.activeBattle.name}`)
      }
  }, [gameData]);


  return (
    <div className="flex flex-col">
      <CustomInput 
        label="Name"
        placeholder="Enter your player name"
        value={playerName}
        handleValueChange={setPlayerName}
        onChange={console.log(playerName)  }
      />
      <CustomButton 
        title="Register"
        handleClick={handleClick}
        restStyles="mt-6"
      />
    </div>
  )
};

export default PageHOC(
  Home, 
  <>Welcome to Avax Gods <br /> a Web3 NFT Card Game</>,
  <>Connect your wallet to start playing <br /> the ultimate Web3 Battle Card Game</>
);