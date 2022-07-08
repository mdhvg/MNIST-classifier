import torch.optim as optim
import torch.nn as nn
import torch.nn.functional as F
import torch

# Define model
class Net(nn.Module):
  def __init__(self):
    super().__init__()
    self.conv1 = nn.Conv2d(1, 8, (3,3), 2, 1)
    self.conv2 = nn.Conv2d(8, 16, (3,3), 2, 1)
    self.conv3 = nn.Conv2d(16, 32, (3,3), 2, 1)
    self.max = nn.MaxPool2d(2, 1, 1)
    self.linear = nn.Linear(1152, 10)
  
  def forward(self, x):
    x = x.view(-1, 28, 28)
    x = F.relu(self.conv1(x))
    x = F.relu(self.max(x))
    x = F.relu(self.conv2(x))
    x = F.relu(self.max(x))
    x = F.relu(self.conv3(x))
    x = F.relu(self.max(x))
    return torch.sigmoid(self.linear(x.view(1,-1))).view(-1)

net = Net()
net.load_state_dict(torch.load("./model/MNIST.pth"))

optimizer = optim.Adam(net.parameters(), lr=0.0001)