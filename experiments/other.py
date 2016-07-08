import math

# yesNum = int(input("Enter starting number of yes shares: "))
# noNum = int(input("Enter starting number of no shares: "))
# b = int(input("Enter b: "))
yesNum = 500
noNum = 500


userYes = 0
userNo = 0

comission = .05
alpha = comission / (2 * math.log(2))
alpha = .04
print(alpha)
def fb(alpha, main, opposite):
	return 1.0 * alpha * (main + opposite)

# derivative of the cost function
def getCurrentPrice(main, opposite):
	main = 1.0 * main
	opposite = 1.0 * opposite
	b = fb(alpha, main, opposite)
	# return math.exp(1.0 * yesNum / b) / (1.0 * math.exp(yesNum / b) + math.exp(1.0 * noNum / b))
	firstTerm = alpha * math.log(math.exp(main / b) + math.exp(opposite / b))
	
	secondTermTop = ((main * math.exp(main / b)) + (opposite * math.exp(main / b))) - ((main * math.exp(main / b)) + (opposite * math.exp(opposite / b)))
	
	secondTermBottom = (main * (math.exp(main / b) + math.exp(opposite / b))) + (opposite * (math.exp( main / b) + math.exp(opposite / b)))
	
	return firstTerm + 1.0 * secondTermTop / secondTermBottom

# the cost function where main is the instrument we're getting the "cost" of and opposite is its opposite
def getCost(main, opposite):
	# return b * math.log(math.exp(1.0 * main / b) + math.exp(1.0 * opposite / b))
	b = fb(alpha, main, opposite)
	return b * math.log(
			math.exp(1.0 * main / b) + math.exp(1.0 * opposite / b)
		)

while True:
	print("You have {} yes shares and {} no shares".format(userYes, userNo))
	yPrice = getCurrentPrice(yesNum, noNum)
	nPrice = getCurrentPrice(noNum, yesNum)

	print(("Current price: {} / {} ==> {}. {}").format(yPrice, nPrice, yPrice + nPrice, yPrice / (yPrice + nPrice)))
	
	command = raw_input("Enter command: ").split(" ")
	
	if (command[0] == "reset"):
		yesNum = 0
		noNum = 0
		userYes = 0
		userNo = 0
		continue

	if len(command) != 3:
		print("Invalid command. Muste be of form [buy|sell] x [yes|no]")
		continue
	
	try:
		command[1] = int(command[1])
	except ValueError:
		print("Invalid command. Second word must be a valid integer")
		continue

	operation = command[0]
	quantity = command[1]
	instrument = command[2]

	if instrument == "yes":
		cost = 0
		verb = ""
		if operation == "buy":
			verb = "bought"
			cost = getCost(yesNum + quantity, noNum) - getCost(yesNum, noNum)
			yesNum = yesNum + quantity
			userYes = userYes + quantity
		elif operation == "sell":
			if userYes < quantity:
				print("You fool. You don't even have that many shares")
				continue
			verb = "sold"
			cost = getCost(yesNum - quantity, noNum) - getCost(yesNum, noNum)
			yesNum = yesNum - quantity
			userYes = userYes - quantity			
		else:
			print("Invalid command. First word must be 'buy' or 'sell'. Example: 'buy 1 yes'")
			continue

		print("You {} {} {} shares for a total of {}".format(verb, quantity, instrument, cost))
	elif instrument == "no":
		cost = 0
		verb = ""
		if operation == "buy":
			verb = "bought"
			cost = getCost(yesNum, noNum + quantity) - getCost(yesNum, noNum)
			noNum = noNum + quantity
			userNo = userNo + quantity
		elif operation == "sell":
			if userNo < quantity:
				print("You fool. You don't even have that many shares")
				continue
			verb = "sold"
			cost = getCost(yesNum, noNum + quantity) - getCost(yesNum, noNum)
			noNum = noNum - quantity
			userNo = userNo - quantity			
		else:
			print("Invalid command. First word must be 'buy' or 'sell'. Example: 'buy 1 yes'")
			continue
		print("You {} {} {} shares for a total of {}".format(verb, quantity, instrument, cost))
	else:
		print("Invalid command. Third word must be 'yes' or 'no'.")
		continue
	print("")
