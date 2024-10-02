
# AI Model Marketplace dApp

## Overview

A decentralized application that allows users to list, purchase, and rate AI models.

## Usage

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/3xamp13/ai-model-marketplace.git
   ```

2. **Install Dependencies:**

   ```bash
   cd ai-model-marketplace
   npm install
   ```

3. **Run Ganache and Deploy Contracts:**

   ```bash
   truffle migrate --reset
   ```

4. **Start the Frontend:**

   ```bash
   cd front
   npm run dev
   ```

5. **Interacting with the Models**

   ![Image alt](https://github.com/3xamp13/aimarketplace/blob/main/front-workplace.png)

   - To list a new model: Enter the model name, description, and price, then press the "List Model" button.
   - Available models will be displayed if any exist.
   - To rate a model: Purchase it first, then enter the model ID and the appropriate rating.
   - To withdraw funds: Press the "Withdraw Funds" button.
