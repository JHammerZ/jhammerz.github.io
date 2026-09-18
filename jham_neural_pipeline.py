import math
import random

class JHamSovereignNeuralNetwork:
    def __init__(self, input_dim, hidden_dim, output_dim):
        self.version = "1.0.0-CustomPipeline"
        
        # Initialize weights and biases using small random values
        self.w1 = [[random.uniform(-0.1, 0.1) for _ in range(hidden_dim)] for _ in range(input_dim)]
        self.b1 = [0.0 for _ in range(hidden_dim)]
        
        self.w2 = [[random.uniform(-0.1, 0.1) for _ in range(output_dim)] for _ in range(hidden_dim)]
        self.b2 = [0.0 for _ in range(output_dim)]
        
        print("======================================================================")
        print("[★] INITIALIZING BARE-METAL NEURAL NETWORK PIPELINE FROM SCRATCH")
        print(f"[★] Topology Map : Input({input_dim}) ➔ Hidden({hidden_dim}) ➔ Output({output_dim})")
        print("======================================================================")

    def _sigmoid(self, x):
        """Standard non-linear activation function."""
        try:
            return 1.0 / (1.0 + math.exp(-x))
        except OverflowError:
            return 0.0 if x < 0 else 1.0

    def _sigmoid_derivative(self, sx):
        """Calculates derivative using the pre-computed sigmoid output value."""
        return sx * (1.0 - sx)

    def forward_propagation(self, input_vector):
        """Passes inputs forward through the network layers."""
        # Layer 1 computation (Input to Hidden)
        self.hidden_activated = []
        for j in range(len(self.b1)):
            layer1_sum = self.b1[j]
            for i in range(len(input_vector)):
                layer1_sum += input_vector[i] * self.w1[i][j]
            self.hidden_activated.append(self._sigmoid(layer1_sum))
            
        # Layer 2 computation (Hidden to Output)
        self.output_activated = []
        for k in range(len(self.b2)):
            layer2_sum = self.b2[k]
            for j in range(len(self.hidden_activated)):
                layer2_sum += self.hidden_activated[j] * self.w2[j][k]
            self.output_activated.append(self._sigmoid(layer2_sum))
            
        return self.output_activated

    def execute_backpropagation_pass(self, input_vector, target_vector, learning_rate=0.1):
        """Computes errors, calculates gradients, and modifies weight parameters in RAM."""
        # 1. Output Layer Gradients
        output_deltas = []
        for k in range(len(self.output_activated)):
            error = target_vector[k] - self.output_activated[k]
            output_deltas.append(error * self._sigmoid_derivative(self.output_activated[k]))
            
        # 2. Hidden Layer Gradients
        hidden_deltas = []
        for j in range(len(self.hidden_activated)):
            error = 0.0
            for k in range(len(output_deltas)):
                error += output_deltas[k] * self.w2[j][k]
            hidden_deltas.append(error * self._sigmoid_derivative(self.hidden_activated[j]))
            
        # 3. Update Hidden-to-Output Weights and Biases
        for j in range(len(self.hidden_activated)):
            for k in range(len(output_deltas)):
                self.w2[j][k] += learning_rate * output_deltas[k] * self.hidden_activated[j]
        for k in range(len(output_deltas)):
            self.b2[k] += learning_rate * output_deltas[k]
            
        # 4. Update Input-to-Hidden Weights and Biases
        for i in range(len(input_vector)):
            for j in range(len(hidden_deltas)):
                self.w1[i][j] += learning_rate * hidden_deltas[j] * input_vector[i]
        for j in range(len(hidden_deltas)):
            self.b1[j] += learning_rate * hidden_deltas[j]

    def train_on_ingested_data(self, dataset, epochs=1000):
        """Trains the network explicitly on the precise data matrix array ordered to ingest."""
        print(f"[*] Ingesting customized dataset. Beginning {epochs} optimization cycles...")
        for epoch in range(epochs):
            total_loss = 0.0
            for sample_input, sample_target in dataset:
                outputs = self.forward_propagation(sample_input)
                self.execute_backpropagation_pass(sample_input, sample_target)
                
                # Accumulate Mean Squared Error metrics
                for k in range(len(sample_target)):
                    total_loss += (sample_target[k] - outputs[k]) ** 2
                    
            if epoch % (epochs // 5) == 0 or epoch == epochs - 1:
                print(f"    [➔] Epoch {epoch:4d} / {epochs} | Total Network Loss Floor: {total_loss:.6f}")
        print("[✓] Custom pipeline training sequence complete.\n")

if __name__ == "__main__":
    # Define a clean, basic binary data matrix to ingest (e.g., modeling XOR logic gates)
    user_ordered_dataset = [
        ([0.0, 0.0], [0.0]),
        ([0.0, 1.0], [1.0]),
        ([1.0, 0.0], [1.0]),
        ([1.0, 1.0], [0.0])
    ]
    
    # Initialize network with 2 input features, 4 hidden neurons, and 1 output node
    nn = JHamSovereignNeuralNetwork(input_dim=2, hidden_dim=4, output_dim=1)
    nn.train_on_ingested_data(user_ordered_dataset, epochs=2000)
    
    # Test network verification metrics post-optimization
    print("==========================================================")
    print("        VERIFYING POST-OPTIMIZATION NETWORK OUTPUTS       ")
    print("==========================================================")
    for test_input, _ in user_ordered_dataset:
        prediction = nn.forward_propagation(test_input)
        print(f"[*] Input: {test_input} ➔ Model Matrix Prediction: [{prediction[0]:.4f}]")
    print("==========================================================")
