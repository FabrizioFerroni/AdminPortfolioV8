import { Component, OnInit } from '@angular/core';
import { LucideBriefcase } from '@lucide/angular';

@Component({
  selector: 'app-login',
  imports: [LucideBriefcase],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export default class Login implements OnInit {
  ngOnInit(): void {}
}
