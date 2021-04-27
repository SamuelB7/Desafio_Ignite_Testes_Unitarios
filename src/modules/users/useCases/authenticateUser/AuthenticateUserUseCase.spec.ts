import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { compare } from 'bcryptjs';
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let authenticateUserUseCase: AuthenticateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase : CreateUserUseCase

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it("Should be able to authenticate an user", async () => {
    const user = {
      name: "User Name",
      email: "user@email.com",
      password:"userpassword"
    }

    const userCreated = await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password
    })

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    })

    expect(result).toHaveProperty('token')
  })

  it("Should not be able to authenticate a non existent user", async () => {
    expect(async () => {
      const result = await authenticateUserUseCase.execute({
        email:"false@email.com",
        password: "4321"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it("Should no be able to authenticate an user with incorrect password", async () => {
    expect(async () => {
      const user = {
        name: "User Name",
        email: "user@email.com",
        password:"userpassword"
      }

      const userCreated = await createUserUseCase.execute({
        name: user.name,
        email: user.email,
        password: user.password
      })

      const result = await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrongpassword"
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
