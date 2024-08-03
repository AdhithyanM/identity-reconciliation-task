import { AppDataSource } from "../../../setup/db";
import { Contact } from "../repositories/Contact";
import { IdentityRequest, IdentityResponse } from "../types";

class IdentityService {
  private contactRepository = AppDataSource.getRepository(Contact);

  public async findOrCreateContact(
    identityRequest: IdentityRequest
  ): Promise<IdentityResponse> {
    const { phoneNumber, email } = identityRequest;

    if (!phoneNumber && !email) {
      throw new Error("Either phone number or email must be provided");
    }

    // constructing query conditions
    const queryConditions: Array<Partial<Contact>> = [];
    if (phoneNumber)
      queryConditions.push({ phoneNumber: phoneNumber.toString() });
    if (email) queryConditions.push({ email });

    // get all the related contacts
    const contacts = await this.contactRepository.find({
      where: queryConditions,
      order: {
        createdAt: "ASC",
      },
    });

    // No existing contact. create a new primary contact
    if (contacts.length === 0) {
      const newContact = new Contact(
        phoneNumber?.toString(),
        email,
        undefined,
        "primary"
      );
      await this.contactRepository.save(newContact);

      return this.constructIdentityResponse(newContact, []);
    }

    // There are existing contacts matching the given phoneNumber or email
    // Segregate them into primary and secondary
    let primaryContacts: Contact[] = [];
    let secondaryContacts: Contact[] = [];
    contacts.forEach((contact) => {
      if (contact.linkPrecendence == "primary") primaryContacts.push(contact);
      else if (contact.linkPrecendence == "secondary")
        secondaryContacts.push(contact);
    });

    // There can be more than one primary incase the incoming phoneNumber and email points to different existing primary records
    // In that case treat the oldest created contact as primary and the mark other as secondary
    if (primaryContacts.length === 2) {
      let contact = primaryContacts[1];
      contact.linkPrecendence = "secondary";
      contact.linkedId = primaryContacts[0].id;
      await this.contactRepository.save(contact);
      secondaryContacts.push(contact);

      primaryContacts.splice(1);

      return this.constructIdentityResponse(
        primaryContacts[0],
        secondaryContacts
      );
    }
    // Given phoneNumber and email relates to 1 primary contact
    // check and create a new contact if we have new information
    else if (primaryContacts.length === 1) {
      let isPresent: boolean = this.isMatching(
        primaryContacts[0],
        phoneNumber,
        email
      );

      secondaryContacts = await this.contactRepository.findBy({
        linkedId: primaryContacts[0].id,
      });

      secondaryContacts.forEach((contact) => {
        if (this.isMatching(contact, phoneNumber, email)) {
          isPresent = true;
        }
      });

      if (!isPresent) {
        let newContact = new Contact(
          phoneNumber?.toString(),
          email,
          primaryContacts[0].id,
          "secondary"
        );
        await this.contactRepository.save(newContact);
        secondaryContacts.push(newContact);
      }

      return this.constructIdentityResponse(
        primaryContacts[0],
        secondaryContacts
      );
    }
    // Given details point to some secondary contacts and doesn't directly relate to primary contact.
    // In that case all matching secondary contacts will point to one primary contact.
    else {
      let primaryContact: Contact | null =
        await this.contactRepository.findOneBy({
          id: secondaryContacts[0].linkedId,
        });

      secondaryContacts = await this.contactRepository.findBy({
        linkedId: primaryContact!.id,
      });

      let isPresent: boolean = false;
      secondaryContacts.forEach((contact) => {
        if (this.isMatching(contact, phoneNumber, email)) {
          isPresent = true;
        }
      });

      if (!isPresent) {
        let newContact = new Contact(
          phoneNumber?.toString(),
          email,
          primaryContact!.id,
          "secondary"
        );
        await this.contactRepository.save(newContact);
        secondaryContacts.push(newContact);
      }

      return this.constructIdentityResponse(primaryContact!, secondaryContacts);
    }
  }

  private isMatching(
    contact: Contact,
    phoneNumber: number | undefined,
    email: string | undefined
  ): boolean {
    let matching = true;
    if (
      phoneNumber &&
      contact.phoneNumber &&
      phoneNumber.toString() !== contact.phoneNumber
    )
      matching = false;
    if (email && contact.email && email !== contact.email) matching = false;
    return matching;
  }

  private constructIdentityResponse(
    primaryContact: Contact,
    secondaryContacts: Contact[]
  ): IdentityResponse {
    const emails = new Set<string>();
    const phoneNumbers = new Set<string>();
    const secondaryContactIds: number[] = [];

    if (primaryContact.email) emails.add(primaryContact.email);
    if (primaryContact.phoneNumber)
      phoneNumbers.add(primaryContact.phoneNumber);

    for (const contact of secondaryContacts) {
      if (contact.email) {
        emails.add(contact.email);
      }
      if (contact.phoneNumber) {
        phoneNumbers.add(contact.phoneNumber);
      }
      secondaryContactIds.push(contact.id);
    }

    return {
      contact: {
        primaryContactId: primaryContact.id,
        emails: Array.from(emails),
        phoneNumbers: Array.from(phoneNumbers),
        secondaryContactIds,
      },
    };
  }
}

export default IdentityService;
