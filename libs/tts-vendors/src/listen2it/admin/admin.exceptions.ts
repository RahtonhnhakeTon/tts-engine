export class L2iException extends Error {
  message: string;

  constructor() {
    super('');
  }
}
export class AccountIdAlreadyExistsException extends L2iException {
  message: string =
    'This user id was previously registered on listen2it, cannot use it again';
}

export class EmailAlreadyUsedException extends L2iException {
  message: string =
    'This email address is already linked to a different listen2it workspace';
}
