import { StyleSheet } from "react-native";

export default StyleSheet.create({
  page: {
    flex: 1,
  },
  iconContainer: {
    position: "absolute",
    top: 40,
    left: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 5 / 2,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 8,
  },
  menuTitle: {
    marginTop: 1,
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.7,
  },
  subtitle: {
    fontSize: 15,
    color: "#525252",
  },
  container: {
    margin: 10,
  },
  button: {
    backgroundColor: "black",
    marginTop: "auto",
    padding: 20,
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  taskTitle:{
    backgroundColor: "#ffffff",
    color: "#ff7518",
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    padding: 7,
    // elevation: 1,
    margin: 10,
    marginBottom: 0,
    borderRadius: 5
  }
});
